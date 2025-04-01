"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Define form data type
interface KitFormValues {
  name: string
  description: string
  category: string
  price: number
  status: string
  image: string
}

export default function EditKitPage() {
  const router = useRouter()
  const params = useParams()
  const kitId = params.id as string
  const supabase = createClientComponentClient()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Initialize form
  const form = useForm<KitFormValues>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      status: "",
      image: "",
    }
  })

  // Fetch kit data on mount
  useEffect(() => {
    const fetchKitData = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('kits')
          .select(`
            id,
            name,
            description,
            category,
            price,
            status,
            image
          `)
          .eq('id', kitId)
          .single()

        if (error) throw error

        if (data) {
          // Reset form with fetched data
          form.reset({
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            price: data.price || 0,
            status: data.status || "",
            image: data.image || "",
          })

          // Get the image URL if there is an image path
          if (data.image) {
            const { data: imageData } = await supabase.storage
              .from('kit-images')
              .getPublicUrl(data.image)

            setImageUrl(imageData?.publicUrl || "/placeholder.svg")
          }
        }
      } catch (error) {
        console.error("Error fetching kit:", error)
        toast({
          title: "Error",
          description: "Failed to load kit data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (kitId) {
      fetchKitData()
    }
  }, [kitId, supabase, form])

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  // Save kit changes
  const onSubmit = async (values: KitFormValues) => {
    setIsSaving(true)
    try {
      let imagePath = values.image
      
      // Upload new image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${kitId}-${Date.now()}.${fileExt}`
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('kit-images')
          .upload(fileName, imageFile)
          
        if (uploadError) throw uploadError
        
        imagePath = fileName
      }
      
      // Update kit data in the database
      const { error } = await supabase
        .from('kits')
        .update({
          name: values.name,
          description: values.description,
          category: values.category,
          price: values.price,
          status: values.status,
          image: imagePath,
        //   updated_at: new Date().toISOString(),
        })
        .eq('id', kitId)
        
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Kit has been updated successfully",
      })
      
      // Redirect to kit details page
      router.push(`/producer/admin/kits/${kitId}`)
    } catch (error) {
      console.error("Error updating kit:", error)
      toast({
        title: "Error",
        description: "Failed to update kit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Delete kit
  const handleDelete = async () => {
    try {
      // Delete files from kit_files table first (foreign key constraint)
      const { error: deleteFilesError } = await supabase
        .from('kit_files')
        .delete()
        .eq('kit_id', kitId)
        
      if (deleteFilesError) throw deleteFilesError
      
      // Then delete the kit record
      const { error: deleteKitError } = await supabase
        .from('kits')
        .delete()
        .eq('id', kitId)
        
      if (deleteKitError) throw deleteKitError
      
      toast({
        title: "Success",
        description: "Kit has been deleted successfully",
      })
      
      // Redirect to kits page
      router.push("/producer/admin/kits")
    } catch (error) {
      console.error("Error deleting kit:", error)
      toast({
        title: "Error",
        description: "Failed to delete kit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading kit data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/producer/admin/kits/${kitId}`} className="gap-2">
            <ArrowLeft size={16} />
            Back to Kit Details
          </Link>
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Kit</h1>
              <p className="text-muted-foreground">Update your kit details and settings.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-1"
              >
                <Trash2 size={16} />
                Delete Kit
              </Button>
              <Button
                variant="premium"
                size="sm"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSaving}
                className="gap-1"
              >
                {isSaving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 glass-card">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update the core details of your kit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Kit Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="glass-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={5} className="glass-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="glass-input">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="drum-kit">Drum Kit</SelectItem>
                                <SelectItem value="melody-loops">Melody Loops</SelectItem>
                                <SelectItem value="sample-pack">Sample Pack</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="glass-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Kit Image</CardTitle>
                    <CardDescription>
                      Update the cover image for your kit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg glass-input">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt="Kit cover image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <FormLabel
                        htmlFor="image-upload"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-muted/30 transition-colors"
                      >
                        <Upload size={16} />
                        <span>Upload new image</span>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </FormLabel>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-2 pt-2">
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="glass-input">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this kit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 size={14} className="mr-2" />
              Delete Kit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}