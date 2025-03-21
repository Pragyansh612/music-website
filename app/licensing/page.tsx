import Link from "next/link"
import { Check, X } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function LicensingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight mb-4">Licensing Information</h1>
              <p className="text-xl text-muted-foreground">
                Clear guidelines on how you can use our free music kits in your productions.
              </p>
            </div>

            <Card className="backdrop-blur-lg bg-background/80 border border-border mb-12">
              <CardHeader>
                <CardTitle>License Overview</CardTitle>
                <CardDescription>
                  All ProdByShyrap kits are provided under our Royalty-Free License, which grants you extensive rights
                  to use the samples in your productions.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  When you download any kit from ProdByShyrap, you are granted a non-exclusive, worldwide, royalty-free
                  license to use the included samples in your music productions under the terms outlined below. This
                  license is designed to give you creative freedom while protecting our intellectual property.
                </p>

                <p>
                  Our goal is to provide clear, straightforward licensing terms that allow you to focus on creating
                  music without worrying about complex legal restrictions. If you have any questions about our license
                  terms, please don't hesitate to contact us.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                    Permitted Uses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Commercial Music Releases</h3>
                      <p className="text-sm text-muted-foreground">
                        You can use our samples in songs that you sell, stream, or otherwise monetize.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Modification & Adaptation</h3>
                      <p className="text-sm text-muted-foreground">
                        You can modify, edit, process, and adapt the samples to fit your creative vision.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Multiple Projects</h3>
                      <p className="text-sm text-muted-foreground">
                        You can use the samples in multiple different projects without additional licensing.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Media Productions</h3>
                      <p className="text-sm text-muted-foreground">
                        You can use the samples in films, videos, games, podcasts, and other media productions.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Live Performances</h3>
                      <p className="text-sm text-muted-foreground">
                        You can use the samples in live performances, concerts, and DJ sets.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                    Prohibited Uses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Redistribution as Samples</h3>
                      <p className="text-sm text-muted-foreground">
                        You cannot resell, redistribute, or share the samples as they are or as part of another sample
                        pack.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Claiming Ownership</h3>
                      <p className="text-sm text-muted-foreground">
                        You cannot claim ownership of the original samples or copyright them as your own creations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Unauthorized Distribution</h3>
                      <p className="text-sm text-muted-foreground">
                        You cannot share your download with others - please direct them to our website instead.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Competitive Services</h3>
                      <p className="text-sm text-muted-foreground">
                        You cannot use our samples to create a competing sample library or sound design service.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Illegal or Harmful Content</h3>
                      <p className="text-sm text-muted-foreground">
                        You cannot use our samples in content that promotes hate speech, violence, or illegal
                        activities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Licensing Questions</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Do I need to credit ProdByShyrap when using the samples?</h3>
                  <p className="text-muted-foreground">
                    While not required under our license, we appreciate credits! If you'd like to credit us, you can
                    mention "Samples by ProdByShyrap" in your track description or project credits.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Can I use these samples in music that will be released on streaming platforms?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can use our samples in music released on any platform, including Spotify, Apple Music,
                    YouTube, SoundCloud, and others. You retain 100% of your streaming royalties.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Can I use these samples in client work or work-for-hire projects?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, you can use our samples in projects you create for clients. The license transfers to the final
                    product, so your clients don't need to worry about additional licensing.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Is there a limit to how many projects I can use these samples in?
                  </h3>
                  <p className="text-muted-foreground">
                    No, there is no limit. You can use the samples in as many different projects as you want under the
                    same license terms.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">What if I need a custom license for a specific use case?</h3>
                  <p className="text-muted-foreground">
                    If you have a specific use case that isn't covered by our standard license, please
                    <Link href="/contact" className="text-primary hover:underline">
                      {" "}
                      contact us{" "}
                    </Link>
                    to discuss custom licensing options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

