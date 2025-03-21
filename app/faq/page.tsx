import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about our kits and services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Are the kits really free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all our kits are 100% free to download and use. We believe in providing high-quality resources
                    to producers without financial barriers. There are no hidden fees, subscriptions, or premium tiers.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I use these kits in commercial projects?</AccordionTrigger>
                  <AccordionContent>
                    All our kits are royalty-free and can be used in both commercial and non-commercial projects. You
                    can use them in songs you sell, monetize on streaming platforms, or include in client work. The only
                    restriction is that you cannot resell the samples themselves or include them in another sample pack.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Do I need to credit ProdByShyrap when using the kits?</AccordionTrigger>
                  <AccordionContent>
                    While not required, we appreciate credits! If you'd like to credit us, you can mention "Samples by
                    ProdByShyrap" in your track description or project credits. We also love to hear music made with our
                    kits, so feel free to tag us on social media.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>What formats do the kits come in?</AccordionTrigger>
                  <AccordionContent>
                    All our samples are provided in high-quality 24-bit WAV format, ensuring maximum flexibility and
                    quality for your productions. This format is compatible with all major DAWs and audio software.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How often do you release new kits?</AccordionTrigger>
                  <AccordionContent>
                    We typically release new kits monthly, but this can vary. The best way to stay updated on new
                    releases is to subscribe to our newsletter or follow us on social media.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Can I request specific types of kits or sounds?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We welcome suggestions and requests from our community. If there's a specific type of kit or
                    sound you'd like to see, please reach out through our contact form. While we can't guarantee we'll
                    create every requested kit, we do consider all feedback when planning future releases.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>How do I download the kits?</AccordionTrigger>
                  <AccordionContent>
                    Simply navigate to our Kits page, browse the available kits, and click on the one you're interested
                    in. On the kit's detail page, you'll find a "Download" button. Click it, and the download will begin
                    automatically. The kits are provided as ZIP files that you'll need to extract before use.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Are the samples pre-cleared for copyright?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all our samples are original creations or properly licensed, so you don't need to worry about
                    copyright issues when using them in your productions. We ensure that all our content is legally
                    sound and safe for you to use.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>How can I support ProdByShyrap?</AccordionTrigger>
                  <AccordionContent>
                    The best ways to support us are to share our kits with fellow producers, follow us on social media,
                    and tag us in productions you make using our samples. If you'd like to provide financial support, we
                    have a donation option on our website that helps us continue providing free resources.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>I'm having technical issues with a kit. What should I do?</AccordionTrigger>
                  <AccordionContent>
                    If you're experiencing any technical issues with downloading or using our kits, please reach out
                    through our contact form with details about the problem. Our team will assist you as soon as
                    possible. Common issues can often be resolved by using a different browser for downloads or updating
                    your extraction software.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

