import Link from "next/link";
import { TrendingUp, ChevronRight, ArrowLeft, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Article {
  title: string;
  description: string;
  href: string;
}

interface HelpCategoryLayoutProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  articles: Article[];
}

export function HelpCategoryLayout({
  icon,
  title,
  description,
  articles,
}: HelpCategoryLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground">Critted</span>
          </Link>
          <Link href="/help">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help
            </Button>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-3">
          {articles.map((article) => (
            <Link key={article.href} href={article.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {article.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-6 bg-muted rounded-xl text-center">
          <h3 className="font-semibold mb-2">Can&apos;t find what you&apos;re looking for?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is ready to help
          </p>
          <Link href="/help/contact">
            <Button>Contact Support</Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Critted. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface HelpArticleLayoutProps {
  category: string;
  categoryHref: string;
  title: string;
  children: React.ReactNode;
  relatedArticles?: { title: string; href: string }[];
}

export function HelpArticleLayout({
  category,
  categoryHref,
  title,
  children,
  relatedArticles,
}: HelpArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground">Critted</span>
          </Link>
          <Link href="/help">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help
            </Button>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-12 mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/help" className="hover:text-foreground">Help</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={categoryHref} className="hover:text-foreground">{category}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{title}</span>
        </div>

        {/* Article Header */}
        <h1 className="text-3xl font-bold mb-6">{title}</h1>

        {/* Article Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {children}
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="font-semibold mb-4">Related Articles</h3>
            <div className="space-y-2">
              {relatedArticles.map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        <div className="mt-12 p-6 bg-muted rounded-xl text-center">
          <h3 className="font-semibold mb-2">Was this article helpful?</h3>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">Yes</Button>
            <Button variant="outline" size="sm">No</Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Critted. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
