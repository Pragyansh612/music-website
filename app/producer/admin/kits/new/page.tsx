"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, X, Upload, Music, FileAudio, ImageIcon, Check, Play, Pause, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

interface PreviewFile {
  id: string
  file: File
  name: string
  type: string
  size: number
  url: string
  isPlaying: boolean
}

export default function AddKitPage() {
  const router = useRouter()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "0",
    isPremium: false,
    tags: "",
    status: "draft",
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [kitFiles, setKitFiles] = useState<FileList | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState({
    success: false,
    message: "",
    kitId: " "
  })

  // Check authentication and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add kits",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      setUserId(data.session.user.id)
    }

    checkAuth()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleKitFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setKitFiles(e.target.files)
    }
  }

  const handlePreviewFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => {
        const id = Math.random().toString(36).substring(2, 9)
        return {
          id,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          isPlaying: false,
        }
      })

      setPreviewFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removePreviewFile = (id: string) => {
    setPreviewFiles((prev) => prev.filter((file) => file.id !== id))
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }

  const togglePlayPreview = (id: string) => {
    if (currentlyPlaying === id) {
      // Stop playing
      setCurrentlyPlaying(null)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      // Start playing this file
      setCurrentlyPlaying(id)
      if (audioRef.current) {
        audioRef.current.src = previewFiles.find((file) => file.id === id)?.url || ""
        audioRef.current.play()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a kit",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);
    setUploadProgress(0);
  
    try {
      // Generate a unique ID for the kit
      const kitId = uuidv4();
  
      // 1. Upload thumbnail image to Supabase
      let imagePath = null;
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const filePath = `${userId}/${kitId}/thumbnail.${fileExt}`;
  
        const { error: uploadError } = await supabase.storage
          .from('kit-images')
          .upload(filePath, thumbnailFile);
  
        if (uploadError) throw uploadError;
  
        imagePath = filePath;
      }
  
      // 2. Create the kit record in the database
      const { error: kitError } = await supabase
        .from('kits')
        .insert({
          id: kitId,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          status: formData.status,
          created_by: userId,
          image: imagePath,
          // is_premium: formData.isPremium,
          // tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        });
  
      if (kitError) throw kitError;
  
      // Progress update
      setUploadProgress(20);
  
      // 3. Upload kit files directly to Google Drive main folder
      if (kitFiles && kitFiles.length > 0) {
        let uploadedCount = 0;
        const parentFolderId = '1yRCtRAXTLfWQFyfFeshJgiRJKV5E8FIw';
        
        // Process files sequentially to avoid session conflicts
        for (let i = 0; i < kitFiles.length; i++) {
          const file = kitFiles[i];
          const uniqueFileName = file.name;
          
          try {
            // For large files, create a chunked upload with SMALLER chunks for Vercel
            const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks (reduced from 10MB)
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            
            console.log(`Starting upload for ${file.name} in ${totalChunks} chunks`);
            
            // Initialize upload session
            const initResponse = await fetch('/api/drive/init-upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fileName: uniqueFileName,
                fileType: file.type || 'application/octet-stream',
                parentFolderId
              })
            });
            
            if (!initResponse.ok) {
              throw new Error(`Failed to initialize upload: ${await initResponse.text()}`);
            }
            
            const { uploadId } = await initResponse.json();
            console.log(`Received upload ID: ${uploadId}`);
            
            // Track successful chunks
            let successfulChunks = 0;
            let lastCompletedChunk = -1;
            
            // Upload chunks with retries and a queue to prevent overloading
            const MAX_CONCURRENT_CHUNKS = 3;
            let activeUploads = 0;
            
            // Function to upload a single chunk
            const uploadChunk = async (chunkIndex: number) => {
              if (chunkIndex >= totalChunks) return;
              
              activeUploads++;
              const start = chunkIndex * CHUNK_SIZE;
              const end = Math.min(file.size, start + CHUNK_SIZE);
              const chunk = file.slice(start, end);
              
              console.log(`Uploading chunk ${chunkIndex}/${totalChunks} for ${file.name} (${chunk.size} bytes)`);
              
              // Add retry mechanism
              const MAX_RETRIES = 3;
              let chunkAttempt = 0;
              let chunkSuccess = false;
              
              while (chunkAttempt < MAX_RETRIES && !chunkSuccess) {
                try {
                  const chunkFormData = new FormData();
                  chunkFormData.append('chunk', new Blob([chunk], { type: file.type || 'application/octet-stream' }));
                  chunkFormData.append('uploadId', uploadId);
                  chunkFormData.append('chunkIndex', chunkIndex.toString());
                  chunkFormData.append('totalChunks', totalChunks.toString());
                  
                  const chunkResponse = await fetch('/api/drive/upload-chunk', {
                    method: 'POST',
                    body: chunkFormData,
                  });
                  
                  if (!chunkResponse.ok) {
                    const errorText = await chunkResponse.text();
                    console.error(`Chunk upload failed (attempt ${chunkAttempt + 1}/${MAX_RETRIES}): ${errorText}`);
                    chunkAttempt++;
                    
                    if (chunkAttempt >= MAX_RETRIES) {
                      throw new Error(`Failed to upload chunk after ${MAX_RETRIES} attempts: ${errorText}`);
                    }
                    
                    // Wait before retry with exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, chunkAttempt)));
                  } else {
                    chunkSuccess = true;
                    successfulChunks++;
                    
                    // Track the last completed chunk for progress calculation
                    if (chunkIndex > lastCompletedChunk) {
                      lastCompletedChunk = chunkIndex;
                    }
                    
                    // Update progress - allocate 20% for kit creation, 60% for kit file uploads
                    const fileProgress = i / kitFiles.length;
                    const chunkProgress = successfulChunks / (totalChunks * kitFiles.length);
                    setUploadProgress(20 + Math.round((fileProgress + chunkProgress) * 60));
                    
                    // Get the response data
                    const responseData = await chunkResponse.json();
                    
                    // Check if this was the last chunk and we have file info or if upload has started
                    if (responseData.fileId && responseData.webViewLink) {
                      console.log(`Upload complete for ${file.name}, Google Drive ID: ${responseData.fileId}`);
                      
                      // Add entry to kit_files table with Google Drive info
                      const { error: fileRecordError } = await supabase
                        .from('kit_files')
                        .insert({
                          kit_id: kitId,
                          file_name: file.name,
                          file_type: file.type,
                          file_size: file.size,
                          google_drive_link: responseData.webViewLink,
                          google_drive_file_id: responseData.fileId
                        });
                      
                      if (fileRecordError) {
                        console.error(`Error recording ${file.name}:`, fileRecordError);
                      } else {
                        uploadedCount++;
                      }
                    } else if (responseData.status === 'upload-started' && successfulChunks === totalChunks) {
                      console.log(`All chunks uploaded for ${file.name}, waiting for server processing`);
                      
                      // Since we're using background processing, we need to create the record here
                      const { error: fileRecordError } = await supabase
                        .from('kit_files')
                        .insert({
                          kit_id: kitId,
                          file_name: file.name,
                          file_type: file.type,
                          file_size: file.size,
                          google_drive_link: `Processing - ${uploadId}`, // Placeholder until we get the actual link
                          google_drive_file_id: `processing-${uploadId}` // Placeholder
                        });
                      
                      if (fileRecordError) {
                        console.error(`Error recording ${file.name}:`, fileRecordError);
                      } else {
                        uploadedCount++;
                      }
                    }
                  }
                } catch (error) {
                  console.error(`Error uploading chunk ${chunkIndex} (attempt ${chunkAttempt + 1}/${MAX_RETRIES}):`, error);
                  chunkAttempt++;
                  
                  if (chunkAttempt >= MAX_RETRIES) {
                    throw error;
                  }
                  
                  // Wait before retry with exponential backoff
                  await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, chunkAttempt)));
                } finally {
                  activeUploads--;
                }
              }
            };
            
            // Control concurrency with a simple queue
            let nextChunkToUpload = 0;
            
            while (nextChunkToUpload < totalChunks || activeUploads > 0) {
              // If we can add more uploads and there are chunks left
              while (activeUploads < MAX_CONCURRENT_CHUNKS && nextChunkToUpload < totalChunks) {
                uploadChunk(nextChunkToUpload++);
              }
              
              // Wait a bit before checking again
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            if (successfulChunks !== totalChunks) {
              throw new Error(`Not all chunks uploaded successfully for ${file.name}`);
            }
            
            console.log(`All chunks processed for ${file.name}`);
            
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast({
              title: "Upload Error",
              description: `Failed to upload ${file.name}. ${error instanceof Error ? error.message : 'Please try again.'}`,
              variant: "destructive",
            });
            
            // Continue with next file
          }
        }
        
        // Show overall result after all files processed
        if (uploadedCount === 0 && kitFiles.length > 0) {
          throw new Error("Failed to upload any files");
        }
      }
  
      setUploadProgress(80);
  
      // 4. Upload preview files to Supabase
      if (previewFiles.length > 0) {
        for (let i = 0; i < previewFiles.length; i++) {
          const previewFile = previewFiles[i];
          // Add timestamp or random string to ensure unique file path
          const uniqueId = new Date().getTime();
          const filePath = `${userId}/${kitId}/previews/${uniqueId}-${previewFile.name}`;
  
          try {
            // Upload the file to kit-previews bucket
            const { error: previewUploadError } = await supabase.storage
              .from('kit-previews')
              .upload(filePath, previewFile.file);
  
            if (previewUploadError) throw previewUploadError;
  
            // Add entry to the database for this preview file
            const { error: previewRecordError } = await supabase
              .from('kit_previews')
              .insert({
                kit_id: kitId,
                file_name: previewFile.name, // Keep original file name in the database
                file_path: filePath, // But store the unique path
                file_type: previewFile.type,
                file_size: previewFile.size,
                category: 'audio-preview'
              });
  
            if (previewRecordError) {
              console.error(`Error recording preview ${previewFile.name}:`, previewRecordError);
            }
            
            // Update progress - last 20% for preview files
            setUploadProgress(80 + Math.round(((i + 1) / previewFiles.length) * 20));
          } catch (error) {
            console.error(`Error uploading preview ${previewFile.name}:`, error);
          }
        }
      }
  
      setUploadProgress(100);
      setUploadResult({
        success: true,
        message: "Your kit has been successfully uploaded!",
        kitId: kitId
      });
      setShowSuccessDialog(true);
    }
    catch (error) {
      console.error("Upload process failed:", error);
  
      // Update upload result correctly
      setUploadResult({
        success: false,
        message: `Failed to upload kit. ${error instanceof Error ? error.message : 'Please try again.'}`,
        kitId: ""
      });
  
      toast({
        title: "Upload Error",
        description: `Failed to complete kit upload. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false)
    router.push("/producer/admin/kits")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        ease: [0.22, 1, 0.36, 1],
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
    <div>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight neon-text">Add New Kit</h1>
            <p className="text-muted-foreground">Upload a new sound kit or sample pack to your store.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/producer/admin/kits")}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button variant="premium" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isSubmitting ? "Saving..." : "Save Kit"}
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Kit Information</CardTitle>
                    <CardDescription>Basic information about your sound kit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Kit Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        className="glass-input"
                        placeholder="e.g. Midnight Drums Vol. 1"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        className="glass-input min-h-[150px]"
                        placeholder="Describe your kit in detail. Include information about the sounds, style, and what makes it unique."
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          name="category"
                          value={formData.category}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                          required
                        >
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drum-kit">Drum Kit</SelectItem>
                            <SelectItem value="melody-loops">Melody Loops</SelectItem>
                            <SelectItem value="sample-pack">Sample Pack</SelectItem>
                            <SelectItem value="vocal-samples">Vocal Samples</SelectItem>
                            <SelectItem value="sound-effects">Sound Effects</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Price <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3">$</span>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            className="glass-input pl-7"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPremium">Premium Content</Label>
                        <p className="text-sm text-muted-foreground">Mark this kit as premium content</p>
                      </div>
                      <Switch
                        id="isPremium"
                        checked={formData.isPremium}
                        onCheckedChange={(checked) => handleSwitchChange("isPremium", checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        name="tags"
                        className="glass-input"
                        placeholder="e.g. trap, 808, drums, hip-hop (comma separated)"
                        value={formData.tags}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Add tags to help users find your kit. Separate with commas.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Preview Files</CardTitle>
                    <CardDescription>Upload audio previews for users to listen before downloading</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileAudio size={24} className="text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Upload Preview Files</h3>
                          <p className="text-sm text-muted-foreground">
                            Add audio previews so users can listen before downloading
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: MP3, WAV (Max 5MB per file)
                          </p>
                        </div>
                        <Input
                          id="preview-files"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handlePreviewFilesChange}
                          accept=".mp3,.wav"
                        />
                        <Button variant="outline" type="button" onClick={() => document.getElementById("preview-files")?.click()}>
                          <Plus size={16} className="mr-2" />
                          Add Preview Files
                        </Button>
                      </div>

                      {previewFiles.length > 0 && (
                        <div className="mt-6 text-left">
                          <h4 className="font-medium mb-2">Preview Files ({previewFiles.length})</h4>
                          <div className="space-y-3">
                            {previewFiles.map((file) => (
                              <div key={file.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/20">
                                <button
                                  type="button"
                                  onClick={() => togglePlayPreview(file.id)}
                                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"
                                >
                                  {currentlyPlaying === file.id ? (
                                    <Pause size={16} />
                                  ) : (
                                    <Play size={16} className="ml-0.5" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.type.split("/")[1].toUpperCase()} • {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => removePreviewFile(file.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Hidden audio element for preview playback */}
                    <audio ref={audioRef} className="hidden" onEnded={() => setCurrentlyPlaying(null)} />
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Kit Files</CardTitle>
                    <CardDescription>Upload the sound files for your kit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload size={24} className="text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Upload Kit</h3>
                          <p className="text-sm text-muted-foreground">
                            Drag and drop your sound files here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: WAV, MP3, AIFF, ZIP, RAR (Max 500MB total)
                          </p>
                        </div>
                        <Input
                          ref={fileInputRef}
                          id="kit-files"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleKitFilesChange}
                          accept=".wav,.mp3,.aiff,.zip,.rar"
                        />
                        <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                          <Music size={16} className="mr-2" />
                          Select Files
                        </Button>
                      </div>
                      {kitFiles && (
                        <div className="mt-6 text-left">
                          <h4 className="font-medium mb-2">Selected Files ({kitFiles.length})</h4>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {Array.from(kitFiles).map((file, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/20">
                                <FileAudio size={16} className="text-primary" />
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                    <CardDescription>Upload a cover image for your kit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      {thumbnailPreview ? (
                        <div className="relative aspect-video rounded-md overflow-hidden">
                          <img
                            src={thumbnailPreview || "/placeholder.svg"}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            type="button"
                            className="absolute top-2 right-2 h-8 w-8"
                            onClick={() => {
                              setThumbnailPreview(null)
                              setThumbnailFile(null)
                            }}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-4 py-6">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ImageIcon size={20} className="text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Upload Thumbnail</h3>
                            <p className="text-xs text-muted-foreground">Recommended size: 1200 x 630px</p>
                          </div>
                          <Input
                            id="thumbnail"
                            type="file"
                            className="hidden"
                            onChange={handleThumbnailChange}
                            accept="image/*"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => document.getElementById("thumbnail")?.click()}
                          >
                            <ImageIcon size={14} className="mr-2" />
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Publishing</CardTitle>
                    <CardDescription>Control how your kit is published</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      defaultValue="draft"
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="draft" id="draft" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="draft" className="font-medium">
                            Save as Draft
                          </Label>
                          <p className="text-sm text-muted-foreground">Save but don't publish yet</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="active" id="active" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="active" className="font-medium">
                            Publish Immediately
                          </Label>
                          <p className="text-sm text-muted-foreground">Make available for download right away</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Optimize for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seo-title">SEO Title</Label>
                      <Input id="seo-title" className="glass-input" placeholder="Leave blank to use kit name" />
                      <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo-description">Meta Description</Label>
                      <Textarea
                        id="seo-description"
                        className="glass-input min-h-[80px]"
                        placeholder="Leave blank to use kit description"
                      />
                      <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seo-keywords">Keywords</Label>
                      <Input
                        id="seo-keywords"
                        className="glass-input"
                        placeholder="e.g. free drum kit, trap samples, 808"
                      />
                      <p className="text-xs text-muted-foreground">Separate with commas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => router.push("/producer/admin/kits")}>
                Cancel
              </Button>
              <Button variant="premium" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                    />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    <span>Save Kit</span>
                  </>
                )}
              </Button>
            </div>

            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glass-card bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {uploadResult.success ? "Kit Created Successfully!" : "Error Creating Kit"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {uploadResult.success
                ? `Your new kit has been ${formData.status === "active" ? "published and is now available for download" : "saved as a draft"}.`
                : uploadResult.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-center py-4">
            <div className={`h-16 w-16 rounded-full ${uploadResult.success ? "bg-primary/10" : "bg-destructive/10"} flex items-center justify-center`}>
              {uploadResult.success
                ? <Check size={32} className="text-primary" />
                : <X size={32} className="text-destructive" />
              }
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessConfirm}>
              {uploadResult.success ? "Return to Kits" : "Try Again"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}