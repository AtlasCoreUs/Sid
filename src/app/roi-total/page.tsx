import Hero from '@/components/roi/Hero'
import AnimatedStats from '@/components/roi/AnimatedStats'
import ModulesSelector from '@/components/roi/ModulesSelector'
import TechStack from '@/components/roi/TechStack'
import Footer from '@/components/roi/Footer'
import ScrollProgress from '@/components/roi/ScrollProgress'

export default function RoiTotalPage() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <AnimatedStats />
      <ModulesSelector />
      <TechStack />
      <Footer />
    </>
  )
}
