import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Music, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">About ProdByShyrap</h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Empowering music producers with high-quality free resources since 2020.
                </p>
                <p className="mb-6">
                  ProdByShyrap was founded with a simple mission: to provide aspiring and established music producers
                  with high-quality sound resources without financial barriers. We believe that creativity shouldn't be
                  limited by budget constraints, and that's why we offer our premium-quality kits completely free.
                </p>
                <p className="mb-6">
                  Our team consists of passionate music producers and sound designers who understand the challenges of
                  finding quality samples. We meticulously craft each sound to ensure it meets professional standards
                  and can be seamlessly integrated into your productions.
                </p>
                <Button asChild>
                  <Link href="/kits" className="gap-2">
                    Explore Our Kits <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <Image src="/placeholder.svg?height=600&width=600" alt="Studio setup" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                We're dedicated to democratizing music production by providing free, high-quality resources.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Quality Resources</CardTitle>
                  <CardDescription>
                    We create professional-grade sound kits that rival paid alternatives.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every sample in our kits is meticulously crafted, processed, and tested to ensure it meets the
                    highest standards of quality. We don't compromise on sound design just because our kits are free.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Support</CardTitle>
                  <CardDescription>We believe in nurturing a supportive community of music producers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Beyond providing free kits, we're committed to building a community where producers can connect,
                    share knowledge, and grow together. We regularly feature music created with our kits and provide
                    educational content.
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-background/80 border border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Innovation</CardTitle>
                  <CardDescription>We continuously explore new sounds and production techniques.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The music production landscape is constantly evolving, and so are we. We stay at the forefront of
                    sound design trends and technologies to provide you with cutting-edge samples that help you create
                    forward-thinking music.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Studio equipment"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Mixing console"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Synthesizer"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden border border-border">
                    <Image
                      src="/placeholder.svg?height=300&width=300"
                      alt="Drum machine"
                      width={300}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Our Process</h2>
                <p className="text-muted-foreground mb-6">
                  We take pride in our meticulous approach to creating high-quality sound kits.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-medium text-primary">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Sound Design & Recording</h3>
                      <p className="text-muted-foreground text-sm">
                        We start by designing and recording raw sounds using high-end equipment and innovative
                        techniques to capture unique textures and timbres.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-medium text-primary">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Processing & Refinement</h3>
                      <p className="text-muted-foreground text-sm">
                        Each sound is meticulously processed using professional-grade equipment and software to ensure
                        optimal quality, character, and usability.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-medium text-primary">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Testing & Curation</h3>
                      <p className="text-muted-foreground text-sm">
                        We rigorously test each sample in various musical contexts and only include the very best in our
                        final kits, ensuring versatility and usability.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-medium text-primary">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Organization & Distribution</h3>
                      <p className="text-muted-foreground text-sm">
                        Finally, we organize the samples into intuitive categories, create descriptive file names, and
                        package everything for easy download and immediate use in your productions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/50">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Join Our Community</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with fellow producers, get early access to new kits, and share your music with us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/kits">Browse Kits</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

