import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function TermsPage() {
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
        </div>
      </header>

      <main className="container px-4 py-12 mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: June 12, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Critted (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service. We reserve the right to
              update these terms at any time, and your continued use of the Service constitutes acceptance
              of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Critted is a TikTok Shop trend intelligence platform that provides data analytics, product
              tracking, sound analysis, and AI-powered predictions for TikTok creators and sellers. Our
              Service aggregates publicly available data and third-party data to deliver insights and
              recommendations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Not share your account with others or create multiple free accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscription Plans and Payment</h2>
            <h3 className="text-xl font-medium mb-2">4.1 Pricing</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We offer Free, Basic ($22/month), and Strategy ($27/month) subscription plans. Prices are
              subject to change with 30 days&apos; notice.
            </p>

            <h3 className="text-xl font-medium mb-2">4.2 Billing</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Paid subscriptions are billed monthly in advance. You authorize us to charge your payment
              method on a recurring basis until you cancel.
            </p>

            <h3 className="text-xl font-medium mb-2">4.3 Cancellation</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may cancel your subscription at any time. Cancellation takes effect at the end of the
              current billing period. No refunds are provided for partial months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Scrape, crawl, or use automated means to access the Service</li>
              <li>Resell, redistribute, or sublicense the Service or its data</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content, features, and functionality are owned by Critted
              and are protected by international copyright, trademark, patent, trade secret, and other
              intellectual property laws. You may not copy, modify, distribute, or create derivative
              works based on the Service without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data and Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              The data, analytics, predictions, and recommendations provided by Critted are for
              informational purposes only. While we strive for accuracy, we do not guarantee the
              completeness, reliability, or accuracy of any information. You acknowledge that TikTok
              Shop performance depends on many factors beyond our control, and our predictions are
              not guarantees of future results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRENDFLOW SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR
              REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY. OUR TOTAL LIABILITY SHALL NOT EXCEED
              THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless Critted and its officers, directors,
              employees, and agents from any claims, damages, losses, or expenses arising from your
              use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without
              prior notice, for any reason, including breach of these Terms. Upon termination, your
              right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State
              of California, without regard to its conflict of law provisions. Any disputes shall be
              resolved in the courts of San Francisco County, California.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul className="list-none text-muted-foreground mt-2">
              <li>Email: legal@critted.com</li>
              <li>Address: Critted Inc., 123 Market Street, San Francisco, CA 94105</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Critted. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/help" className="hover:underline">Help Center</Link>
            <Link href="/help/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
