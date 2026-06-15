'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react'
import type { PropertyImage, PropertyVideo } from '@/lib/types/database'

interface PropertyGalleryProps {
  images: PropertyImage[]
  videos?: PropertyVideo[]
}

export function PropertyGallery({ images, videos = [] }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(0)

  const primaryImage = images.find(img => img.is_primary) || images[0]

  const handlePrevImage = () => {
    setLightboxImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    setLightboxImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogTrigger asChild>
          <div className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group">
            <Image
              src={primaryImage?.url || images[0]?.url}
              alt="Property image"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0">
          <div className="relative aspect-video">
            <Image
              src={images[lightboxImage]?.url}
              alt={`Image ${lightboxImage + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {lightboxImage + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedImage(index)
              setLightboxImage(index)
              setLightboxOpen(true)
            }}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              selectedImage === index ? 'ring-2 ring-primary' : ''
            }`}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover hover:opacity-80 transition-opacity"
              sizes="100px"
            />
          </button>
        ))}
        {images.length > 5 && (
          <button
            onClick={() => setLightboxOpen(true)}
            className="relative aspect-square rounded-lg overflow-hidden bg-black/50 flex items-center justify-center"
          >
            <span className="text-white font-medium">+{images.length - 5}</span>
          </button>
        )}
      </div>

      {/* Videos */}
      {videos.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  controls
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/0 transition-colors pointer-events-none">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
