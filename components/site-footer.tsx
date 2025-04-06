"use client"

import Link from "next/link"
import { Instagram, Twitter, Youtube } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 dark:border-white/5 glass">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              <span className="gradient-text neon-text">ProdBy</span>Shyrap
            </h3>
            <p className="text-sm text-muted-foreground">
              Providing free high-quality music kits for producers worldwide.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://youtube.com"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                <span className="absolute -inset-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 bg-primary/10"></span>
                <Youtube size={20} className="relative" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                <span className="absolute -inset-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 bg-primary/10"></span>
                <Instagram size={20} className="relative" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                <span className="absolute -inset-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 bg-primary/10"></span>
                <Twitter size={20} className="relative" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/kits"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  Kits
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/licensing"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  Licensing
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block"
                >
                  My Account
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Subscribe to get updates on new kits and exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex h-9 w-full rounded-md glass-input px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  type="submit"
                  className="h-9 rounded-md px-3 bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 relative overflow-hidden w-full sm:w-auto"
                >
                  Subscribe
                </Button>
              </motion.div>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 dark:border-white/5 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ProdByShyrap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

