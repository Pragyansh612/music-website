"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Instagram, Youtube, Download, Check, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import LoadingComponent from '@/components/Loading';

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
    size: number;
}

export default function KitDownloadPage() {
    const router = useRouter()
    const params = useParams()
    const kitId = params.id as string

    const [kit, setKit] = useState<Kit | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [isDownloading, setIsDownloading] = useState(false)

    // YouTube states
    const [youtubeClicked, setYoutubeClicked] = useState(false)
    const [youtubeCompleted, setYoutubeCompleted] = useState(false)
    const [youtubeCountdown, setYoutubeCountdown] = useState(10)
    const [youtubeCountdownActive, setYoutubeCountdownActive] = useState(false)

    // Instagram states
    const [instagramClicked, setInstagramClicked] = useState(false)
    const [instagramCompleted, setInstagramCompleted] = useState(false)
    const [instagramButtonEnabled, setInstagramButtonEnabled] = useState(false)
    const [instagramCountdown, setInstagramCountdown] = useState(10)
    const [instagramCountdownActive, setInstagramCountdownActive] = useState(false)

    const [downloadClicked, setDownloadClicked] = useState(false)
    const [downloadError, setDownloadError] = useState(false)
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)
    const [downloadButtonEnabled, setDownloadButtonEnabled] = useState(false)
    const [downloadLink, setDownloadLink] = useState("")
    const [fileName, setFileName] = useState("")
    const [progressUpdating, setProgressUpdating] = useState(false)

    useEffect(() => {
        const fetchKitDetails = async () => {
            setIsLoading(true)
            try {
                const { data: kitData, error: kitError } = await supabase
                    .from('kits')
                    .select('*')
                    .eq('id', kitId)
                    .single()

                if (kitError) throw kitError

                if (!kitData) {
                    toast({
                        title: "Kit not found",
                        description: "The requested kit does not exist.",
                        variant: "destructive",
                    })
                    router.push('/kits')
                    return
                }

                // Find the first kit file to use its download link
                const { data: filesData, error: filesError } = await supabase
                    .from('kit_files')
                    .select('*')
                    .eq('kit_id', kitId)
                    .limit(1)

                if (filesError) throw filesError

                if (filesData && filesData.length > 0) {
                    setDownloadLink(filesData[0].google_drive_link)

                    // Extract filename from the link or use kit name
                    // This is a simple approach - you might need to refine this
                    const extractedName = kitData.name.replace(/\s+/g, '_').toLowerCase()
                    setFileName(`${extractedName}.zip`)
                }

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
                })
            } catch (error) {
                console.error("Error fetching kit details:", error)
                toast({
                    title: "Error",
                    description: "Failed to load kit details. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (kitId) {
            fetchKitDetails()
        }
    }, [kitId, router])

    // Handle YouTube countdown
    useEffect(() => {
        if (youtubeCountdownActive) {
            let timer: NodeJS.Timeout | null = null;

            if (youtubeCountdown > 0) {
                timer = setInterval(() => setYoutubeCountdown(prev => prev - 1), 1000);
            }

            if (youtubeCountdown === 0) {
                setYoutubeCompleted(true);
                setInstagramButtonEnabled(true);
                setYoutubeCountdownActive(false);

                // Update progress after YouTube step completes
                setProgressUpdating(true);
                // Animate progress bar
                animateProgressTo(50);
            }

            return () => {
                if (timer) clearInterval(timer);
            };
        }
    }, [youtubeCountdown, youtubeCountdownActive]);

    // Handle Instagram countdown
    useEffect(() => {
        if (instagramCountdownActive) {
            let timer: NodeJS.Timeout | null = null;

            if (instagramCountdown > 0) {
                timer = setInterval(() => setInstagramCountdown(prev => prev - 1), 1000);
            }

            if (instagramCountdown === 0) {
                setInstagramCompleted(true);
                setDownloadButtonEnabled(true);
                setInstagramCountdownActive(false);

                // Update progress after Instagram step completes
                setProgressUpdating(true);
                // Animate progress bar
                animateProgressTo(100);
            }

            return () => {
                if (timer) clearInterval(timer);
            };
        }
    }, [instagramCountdown, instagramCountdownActive]);

    // Smooth progress animation function
    const animateProgressTo = (targetValue: number) => {
        setProgressUpdating(true);
        const startValue = downloadProgress;
        const duration = 100;
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        let frame = 0;

        const animate = () => {
            if (frame < totalFrames) {
                const progress = startValue + ((targetValue - startValue) * (frame / totalFrames));
                setDownloadProgress(Math.round(progress));
                frame++;
                requestAnimationFrame(animate);
            } else {
                setDownloadProgress(targetValue);
                setProgressUpdating(false);
            }
        };

        requestAnimationFrame(animate);
    };

    const handleYouTubeClick = () => {
        window.open("https://www.youtube.com/@prodbyshyrap", "_blank")
        setYoutubeClicked(true)
        setYoutubeCountdownActive(true)
    }

    const handleInstagramClick = () => {
        window.open("https://www.instagram.com/shyrap21/", "_blank")
        setInstagramClicked(true)
        setInstagramCountdownActive(true)
    }

    const handleDownloadClick = () => {
        if (downloadLink) {
            setIsDownloading(true)
            setDownloadClicked(true)

            try {
                const downloadUrl = `/api/download?url=${encodeURIComponent(downloadLink)}`

                if (typeof document !== 'undefined') {
                    const iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.src = downloadUrl
                    document.body.appendChild(iframe)
    
                    setTimeout(() => {
                        document.body.removeChild(iframe)
                        setIsDownloading(false)
                        setShowSuccessPopup(true)
                    }, 2000)
                }

                updateDownloadCount()

                toast({
                    title: "Download Started",
                    description: "Your file download has begun. Check your downloads folder.",
                })
            } catch (error) {
                console.error("Error starting download:", error)
                setDownloadError(true)
                setIsDownloading(false)

                toast({
                    title: "Download Failed",
                    description: "Unable to start download. Please try again.",
                    variant: "destructive",
                })
            }
        } else {
            setDownloadError(true)

            toast({
                title: "Download Link Not Available",
                description: "Sorry, the download link for this kit is currently unavailable.",
                variant: "destructive",
            })
        }
    }

    const updateDownloadCount = async () => {
        if (!kit) return

        try {
            // Increment the download count in the database
            await supabase
                .from('kits')
                .update({ downloads: (kit.downloads || 0) + 1 })
                .eq('id', kitId)
        } catch (error) {
            console.error("Error updating download count:", error)
        }
    }

    if (isLoading || !kit) {
        return <LoadingComponent />
    }

    const getLink = () => {
        if (downloadLink) {
            window.open(downloadLink, "_blank")
        } else {
            toast({
                title: "Download Link Not Available",
                description: "Sorry, the download link for this kit is currently unavailable.",
                variant: "destructive",
            })
        }
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

    return (
        <div className="flex min-h-screen flex-col noise">
            <SiteHeader />
            <main className="flex-1 relative overflow-hidden animated-bg">
                <div className="absolute inset-0 noise"></div>
                <div className="container py-6 md:py-10 px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6"
                    >
                        <Button asChild variant="ghost" size="sm" className="mb-4 glass hover:bg-white/20 dark:hover:bg-black/30">
                            <Link href={`/kits/${kitId}`} className="gap-2">
                                <ArrowLeft size={16} />
                                <span className="text-foreground">Back to Kit</span>
                            </Link>
                        </Button>

                        <div className="max-w-3xl mx-auto">
                            <motion.div
                                className="glass-card rounded-lg p-4 sm:p-6 shadow-lg card-3d"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 card-3d-content">
                                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-lg shadow-md flex-shrink-0">
                                        <Image
                                            src={kit.image || "/placeholder.svg"}
                                            alt={kit.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold gradient-text">{kit.name}</h1>
                                        <p className="text-xs sm:text-sm text-muted-foreground">Complete the steps below to download</p>
                                    </div>
                                </div>

                                <div className="mb-6 sm:mb-8">
                                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                                        <span className="text-foreground">Download Progress</span>
                                        <span className="text-foreground font-medium">{downloadProgress}%</span>
                                    </div>
                                    <div className="relative">
                                        <Progress
                                            value={downloadProgress}
                                            className="h-2 transition-all duration-300 ease-in-out"
                                        />
                                        {progressUpdating && (
                                            <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full"></div>
                                        )}
                                    </div>
                                </div>

                                <motion.div
                                    className="space-y-4 sm:space-y-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div variants={itemVariants}>
                                        <Card className={`border ${youtubeCompleted ? "border-green-500/50" : "border-gray-500/30"} glass-card hover-lift`}>
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${youtubeCompleted ? "bg-green-500/20" : "bg-primary/20"}`}>
                                                            {youtubeCompleted ?
                                                                <Check size={16} className="text-green-500" /> :
                                                                youtubeCountdownActive ?
                                                                    <Clock size={16} className="text-primary animate-pulse" /> :
                                                                    <Youtube size={16} className="text-primary" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-sm sm:text-base text-foreground">Visit Our YouTube Channel</h3>
                                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                                {youtubeCountdownActive ?
                                                                    `Please wait ${youtubeCountdown} seconds...` :
                                                                    youtubeCompleted ?
                                                                        "Thank you for visiting our YouTube channel!" :
                                                                        "Support us by checking out our YouTube content"
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={handleYouTubeClick}
                                                        className={`gap-2 text-foreground dark:text-foreground text-xs sm:text-sm mt-2 sm:mt-0 w-full sm:w-auto ${youtubeCompleted ?
                                                            "bg-green-500/20 hover:bg-green-500/30" :
                                                            "bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 btn-shine"}`}
                                                        disabled={youtubeClicked}
                                                    >
                                                        {youtubeCompleted ?
                                                            "Completed" :
                                                            youtubeCountdownActive ?
                                                                `Wait ${youtubeCountdown}s` :
                                                                "Visit YouTube"
                                                        }
                                                        {!youtubeCompleted && !youtubeCountdownActive && <ExternalLink size={14} />}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Card className={`border ${instagramCompleted ?
                                            "border-green-500/50" :
                                            instagramButtonEnabled ?
                                                "border-gray-500/30" :
                                                "border-gray-500/10"} glass-card hover-lift ${!instagramButtonEnabled && "opacity-70"}`}
                                        >
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${instagramCompleted ?
                                                            "bg-green-500/20" :
                                                            "bg-primary/20"}`}
                                                        >
                                                            {instagramCompleted ?
                                                                <Check size={16} className="text-green-500" /> :
                                                                instagramCountdownActive ?
                                                                    <Clock size={16} className="text-primary animate-pulse" /> :
                                                                    <Instagram size={16} className="text-primary" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-sm sm:text-base text-foreground">Follow Us on Instagram</h3>
                                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                                {instagramCountdownActive ?
                                                                    `Please wait ${instagramCountdown} seconds...` :
                                                                    instagramCompleted ?
                                                                        "Thank you for following us on Instagram!" :
                                                                        instagramButtonEnabled ?
                                                                            "Follow our Instagram for updates and new kits" :
                                                                            "Complete the YouTube step first"
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={handleInstagramClick}
                                                        className={`gap-2 text-foreground dark:text-foreground text-xs sm:text-sm mt-2 sm:mt-0 w-full sm:w-auto ${instagramCompleted ?
                                                            "bg-green-500/20 hover:bg-green-500/30" :
                                                            "bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 btn-shine"}`}
                                                        disabled={!instagramButtonEnabled || instagramClicked}
                                                    >
                                                        {instagramCompleted ?
                                                            "Completed" :
                                                            instagramCountdownActive ?
                                                                `Wait ${instagramCountdown}s` :
                                                                "Follow Instagram"
                                                        }
                                                        {!instagramCompleted && !instagramCountdownActive && <ExternalLink size={14} />}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Card className={`border ${downloadButtonEnabled ?
                                            "border-green-500/50" :
                                            "border-gray-500/10"} glass-card hover-lift ${!downloadButtonEnabled && "opacity-70"}`}
                                        >
                                            <CardContent className="p-3 sm:p-4">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${downloadButtonEnabled ?
                                                            "bg-green-500/20" :
                                                            "bg-primary/20"}`}
                                                        >
                                                            <Download size={16} className={downloadButtonEnabled ? "text-green-500" : "text-primary"} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-sm sm:text-base text-foreground">Download Kit</h3>
                                                            <p className="text-xs sm:text-sm text-muted-foreground">
                                                                {downloadButtonEnabled ?
                                                                    "You're all set! Click to download the kit" :
                                                                    "Complete the previous steps first"
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={handleDownloadClick}
                                                        className={`gap-2 text-xs sm:text-sm mt-2 sm:mt-0 w-full sm:w-auto ${downloadButtonEnabled ?
                                                            "premium-btn text-primary-foreground hover:bg-primary/90" :
                                                            "bg-primary/10 text-foreground dark:text-foreground dark:bg-primary/20"
                                                            }`}
                                                        disabled={!downloadButtonEnabled || isDownloading || downloadClicked}
                                                    >
                                                        {isDownloading ?
                                                            "Downloading..." :
                                                            downloadClicked ?
                                                                "Downloaded" :
                                                                "Download Now"
                                                        }
                                                        {!isDownloading && !downloadClicked && <Download size={14} />}
                                                        {downloadClicked && <Check size={14} />}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        {downloadError && (
                                            <motion.div variants={itemVariants} className="mt-4">
                                                <Card className="border border-destructive/50 glass-card">
                                                    <CardContent className="p-4 text-center">
                                                        <div className="mx-auto h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center mb-3">
                                                            <ExternalLink size={20} className="text-destructive" />
                                                        </div>
                                                        <h3 className="font-medium mb-2">Download Failed</h3>
                                                        <p className="text-sm text-muted-foreground mb-4">There was a problem starting your download.</p>
                                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                            <Button
                                                                onClick={() => {
                                                                    setDownloadClicked(false)
                                                                    setDownloadError(false)
                                                                    setIsDownloading(false)
                                                                    handleDownloadClick(); // Try again
                                                                }}
                                                                className="premium-btn text-primary-foreground"
                                                            >
                                                                Try Again
                                                            </Button>
                                                            <Button
                                                                onClick={() => router.push('/kits')}
                                                                className="glass hover:bg-white/20 dark:hover:bg-black/30"
                                                            >
                                                                Browse Other Kits
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
                {/* Success Popup */}
                {showSuccessPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card rounded-lg p-6 max-w-md w-full shadow-lg"
                        >
                            <div className="text-center mb-6">
                                <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                    <Check size={30} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold gradient-text mb-2">Download Started!</h3>
                                <p className="text-muted-foreground">Your download has begun. Check your downloads folder.</p>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={() => router.push('/kits')}
                                    className="w-full premium-btn text-primary-foreground"
                                >
                                    Check Out More Kits
                                </Button>

                                <Button
                                    onClick={() => getLink()}
                                    variant="outline"
                                    className="w-full glass hover:bg-white/20 dark:hover:bg-black/30"
                                >
                                    Download Didn't Started? Get Link
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
            <SiteFooter />
        </div>
    )
}