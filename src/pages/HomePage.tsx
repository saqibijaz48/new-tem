import { useEffect } from 'react'
import { useAppDispatch } from '../lib/hooks'
import { initializeLanguage } from '../lib/features/languageSlice'
import HeroSection from '../components/ui/HeroSection'
import FeaturedProducts from '../components/ui/FeaturedProducts'
import CategoriesSection from '../components/ui/CategoriesSection'

export default function HomePage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Initialize language from localStorage on first load
    dispatch(initializeLanguage())
  }, [dispatch])

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Our Latest Offers
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get exclusive deals, new product
            announcements, and special promotions.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 focus:outline-none"
            />
            <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  )
}