import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "all";

    // Build where clause
    const where: Record<string, unknown> = {
      level: 0, // Top-level categories only
    };

    if (locale !== "all") {
      where.locale = locale;
    }

    // Get categories with product counts and aggregates
    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { productCount: "desc" },
    });

    // Get additional stats per category
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const [productStats, topProduct] = await Promise.all([
          // Get average commission and growth
          prisma.product.aggregate({
            where: { categoryId: cat.id },
            _avg: {
              commissionRate: true,
              velocityChange: true,
            },
          }),
          // Get top product by velocity
          prisma.product.findFirst({
            where: { categoryId: cat.id },
            orderBy: { salesVelocity: "desc" },
            select: { name: true },
          }),
        ]);

        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          locale: cat.locale,
          productCount: cat._count.products,
          avgCommission: productStats._avg.commissionRate || 0,
          growth: productStats._avg.velocityChange || 0,
          topProduct: topProduct?.name || null,
        };
      })
    );

    // Calculate totals
    const totalProducts = categoryStats.reduce((sum, c) => sum + c.productCount, 0);
    const avgGrowth = categoryStats.length > 0
      ? categoryStats.reduce((sum, c) => sum + c.growth, 0) / categoryStats.length
      : 0;
    const avgCommission = categoryStats.length > 0
      ? categoryStats.reduce((sum, c) => sum + c.avgCommission, 0) / categoryStats.length
      : 0;

    return NextResponse.json({
      categories: categoryStats,
      stats: {
        totalCategories: categoryStats.length,
        totalProducts,
        avgGrowth,
        avgCommission,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
