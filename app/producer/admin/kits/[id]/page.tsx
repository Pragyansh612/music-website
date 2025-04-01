"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, FileAudio, Music, Package, Play, Share2, Pause, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SEO } from "@/components/seo-optimization"
import { useRouter, useParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a single Supabase client instance outside the component
const supabase = createClientComponentClient()

interface Kit {
    id: string;
    name: string;
    description: string;
    type: string;
    fileCount: number;
    downloads: number;
    status: string;
    created_at: string;
    image: string;
    price: number;
    category: string;
}

interface KitFile {
    id: string;
    kit_id: string;
    name: string;
    file_url: string;
    file_type: string;
    duration?: string;
    category: string;
}

export default function KitDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const kitId = params.id as string;
    const [kit, setKit] = useState<Kit | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [files, setFiles] = useState<KitFile[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentPreview, setCurrentPreview] = useState<string | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(0.8)
    const [relatedKits, setRelatedKits] = useState<Kit[]>([])

    useEffect(() => {
        const fetchKitDetails = async () => {
            setIsLoading(true);
            try {
                const { data: kitData, error: kitError } = await supabase
                    .from('kits')
                    .select('*')
                    .eq('id', kitId)
                    .single();

                if (kitError) throw kitError;

                if (!kitData) {
                    toast({
                        title: "Kit not found",
                        description: "The requested kit does not exist.",
                        variant: "destructive",
                    });
                    router.push('/kits');
                    return;
                }
                // Set the kit data
                setKit(kitData);

                // Fetch kit files
                const { data: filesData, error: filesError } = await supabase
                    .from('kit_files')
                    .select('*')
                    .eq('kit_id', kitId);

                if (filesError) throw filesError;

                setFiles(filesData || []);

                // Fetch related kits
                const { data: relatedData, error: relatedError } = await supabase
                    .from('kits')
                    .select('*')
                    .neq('id', kitId)
                    .eq('status', 'published')
                    .limit(4);

                if (relatedError) throw relatedError;

                let imageUrl = '/placeholder.svg'
                if (kitData.image) {
                    const { data: imageData } = await supabase.storage
                        .from('kit-images')
                        .getPublicUrl(kitData.image)

                    imageUrl = imageData?.publicUrl || imageUrl
                }

                setKit({
                    ...kitData,
                    image: imageUrl
                });

                // After fetching files data
                if (filesData) {
                    // Format the files with proper URLs
                    const formattedFiles = await Promise.all(filesData.map(async (file) => {
                        // Get the file URL
                        const { data: fileUrlData } = await supabase.storage
                            .from('kit-files')
                            .getPublicUrl(file.file_path)

                        return {
                            ...file,
                            file_url: fileUrlData?.publicUrl || '',
                        }
                    }))

                    setFiles(formattedFiles);
                }
                setRelatedKits(relatedData || []);
            } catch (error) {
                console.error("Error fetching kit details:", error);
                toast({
                    title: "Error",
                    description: "Failed to load kit details. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (kitId) {
            fetchKitDetails();
        }
    }, [kitId, router]);

    console.log(kit)

    if (isLoading || !kit) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p>Loading kit details...</p>
            </div>
        );
    }

    // SEO data for this specific kit
    const seoData = {
        title: `${kit.name} - Free Music Kit | ProdByShyrap`,
        description: `Download ${kit.name} - ${kit.description}. High-quality ${kit.type} for music producers.`,
        keywords: `${kit.name}, ${kit.type}, free samples, music production, music kit, download`,
        ogImage: kit.image,
        ogType: "product",
    }

    // Schema.org structured data for this kit
    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: kit.name,
        image: kit.image,
        description: kit.description,
        brand: {
            "@type": "Brand",
            name: "ProdByShyrap",
        },
        offers: {
            "@type": "Offer",
            price: "0.00",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    }

    const handlePlaySingle = (url: string) => {
        if (currentPreview === url) {
            setIsPlaying(false)
            setCurrentPreview(null)
        } else {
            setIsPlaying(true)
            setCurrentPreview(url)
        }
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number.parseFloat(e.target.value)
        setVolume(newVolume)
        if (newVolume === 0) {
            setIsMuted(true)
        } else {
            setIsMuted(false)
        }
    }

    // Group files by category
    const drumFiles = files.filter(file => file.category === 'drums');
    const melodyFiles = files.filter(file => file.category === 'melodies');

    return (
        <div className="flex min-h-screen flex-col">
            {/* Add SEO component */}
            <SEO {...seoData} />

            {/* Add Schema.org structured data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
            <main className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 noise"></div>
                <div className="container py-10 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                    >
                        <Button asChild variant="ghost" size="sm" className="mb-4 glass">
                            <Link href="/producer/admin/kits" className="gap-2">
                                <ArrowLeft size={16} />
                                Back to Kits
                            </Link>
                        </Button>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                className="relative aspect-square overflow-hidden rounded-lg glass-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <Image
                                    src={kit.image || "/placeholder.svg"}
                                    alt={`${kit.name} - ${kit.type} by ProdByShyrap`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-30"></div>

                                {/* Volume Controls */}
                                {isPlaying && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm p-3 rounded-lg"
                                    >
                                        <button onClick={toggleMute} className="text-white">
                                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer"
                                        />
                                        <span className="text-white text-xs">{Math.round(volume * 100)}%</span>
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.div
                                className="flex flex-col"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="glass">{kit.type}</Badge>
                                    </div>
                                    <h1 className="text-3xl font-bold gradient-text">{kit.name}</h1>
                                    <p className="text-muted-foreground mt-2">{kit.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Files</span>
                                        <span className="font-medium">{kit.fileCount} samples</span>
                                    </div>
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Format</span>
                                        <span className="font-medium">WAV, 24-bit</span>
                                    </div>
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Downloads</span>
                                        <span className="font-medium">{kit.downloads || 0}</span>
                                    </div>
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Released</span>
                                        <span className="font-medium">{new Date(kit.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Price</span>
                                        <span className="font-medium">{kit.price || 0}</span>
                                    </div>
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Category</span>
                                        <span className="font-medium">{kit.category || 0}</span>
                                    </div>
                                    <div className="flex flex-col glass-card p-3 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Status</span>
                                        <span className="font-medium">{kit.status || 0}</span>
                                    </div>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button className="w-full gap-2 glass relative overflow-hidden group h-12 text-lg" size="lg">
                                            <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">Download Kit</span>
                                            <Download size={18} className="relative z-10" />
                                            <span className="absolute inset-0  w-full h-full bg-primary/80 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                                        </Button>
                                    </motion.div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 gap-2 glass">
                                            <Share2 size={16} />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <Tabs defaultValue="samples" className="mt-10">
                        <TabsList className="glass">
                            <TabsTrigger value="samples">Samples</TabsTrigger>
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="license">License</TabsTrigger>
                        </TabsList>

                        <TabsContent value="samples">
                            <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                                {drumFiles.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg font-medium mb-4">Drums</h3>
                                        <div className="space-y-3">
                                            {drumFiles.map((sample, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                    className={`${currentPreview === sample.file_url ? "bg-primary/20 glass-card" : ""}`}
                                                >
                                                    <div className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-primary/10 transition-colors">
                                                        <button
                                                            onClick={() => handlePlaySingle(sample.file_url)}
                                                            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"
                                                        >
                                                            {currentPreview === sample.file_url && isPlaying ? (
                                                                <Pause size={16} />
                                                            ) : (
                                                                <Play size={16} className="ml-0.5" />
                                                            )}
                                                        </button>
                                                        <div className="flex-1">
                                                            <p className="font-medium">{sample.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <FileAudio size={12} />
                                                                <span>WAV • 24-bit • {sample.duration || "0:15"}</span>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <Download size={14} />
                                                            <span className="hidden sm:inline">Download</span>
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {melodyFiles.length > 0 && (
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg font-medium mb-4">Melodies</h3>
                                        <div className="space-y-3">
                                            {melodyFiles.map((sample, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                    className={`${currentPreview === sample.file_url ? "bg-primary/20 glass-card" : ""}`}
                                                >
                                                    <div className="flex items-center gap-3 p-3 rounded-lg glass hover:bg-primary/10 transition-colors">
                                                        <button
                                                            onClick={() => handlePlaySingle(sample.file_url)}
                                                            className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center"
                                                        >
                                                            {currentPreview === sample.file_url && isPlaying ? (
                                                                <Pause size={16} />
                                                            ) : (
                                                                <Play size={16} className="ml-0.5" />
                                                            )}
                                                        </button>
                                                        <div className="flex-1">
                                                            <p className="font-medium">{sample.name}</p>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                <Music size={12} />
                                                                <span>WAV • 24-bit • {sample.duration || "0:30"}</span>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <Download size={14} />
                                                            <span className="hidden sm:inline">Download</span>
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="description">
                            <motion.div
                                className="prose prose-sm dark:prose-invert max-w-none glass-card p-6 rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3>About this Kit</h3>
                                <p>{kit.description}</p>

                                <h3>What's Included</h3>
                                <ul>
                                    <li>{drumFiles.length} drum samples (kicks, snares, hi-hats, percussion)</li>
                                    <li>{melodyFiles.length} melodic loops</li>
                                    <li>24-bit WAV format</li>
                                    <li>Royalty-free for commercial and non-commercial use</li>
                                </ul>

                                <h3>How to Use</h3>
                                <p>
                                    Simply download the kit, extract the files, and import them into your favorite DAW. All samples are
                                    labeled and organized for easy navigation.
                                </p>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="license">
                            <motion.div
                                className="prose prose-sm dark:prose-invert max-w-none glass-card p-6 rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h3>License Terms</h3>
                                <p>
                                    All samples in this kit are 100% royalty-free. You can use them in your commercial and non-commercial
                                    productions without attribution.
                                </p>

                                <h4>You CAN:</h4>
                                <ul>
                                    <li>Use the samples in your music productions, both commercial and non-commercial</li>
                                    <li>Modify, edit, and process the samples to fit your productions</li>
                                    <li>Use the samples in music releases, films, games, and other media</li>
                                </ul>

                                <h4>You CANNOT:</h4>
                                <ul>
                                    <li>Resell or redistribute the samples as they are or as part of another sample pack</li>
                                    <li>Claim ownership of the original samples</li>
                                    <li>Share your download with others - please direct them to our website instead</li>
                                </ul>

                                <p>
                                    For any questions regarding licensing, please visit our{" "}
                                    <Link href="/licensing" className="text-primary hover:underline">
                                        Licensing page
                                    </Link>{" "}
                                    or contact us at{" "}
                                    <a href="mailto:info@prodbyshyrap.com" className="text-primary hover:underline">
                                        info@prodbyshyrap.com
                                    </a>
                                    .
                                </p>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Hidden audio element for preview playback */}
            {currentPreview && (
                <audio
                    src={currentPreview}
                    autoPlay={isPlaying}
                    loop={false}
                    muted={isMuted}
                    // volume={volume}
                    onEnded={() => {
                        setIsPlaying(false)
                        setCurrentPreview(null)
                    }}
                    className="hidden"
                />
            )}
        </div>
    )
}