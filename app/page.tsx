import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import AISearchTool from '@/components/AISearchTool'
import TopSearches from '@/components/TopSearches'
import ServiceButtons from '@/components/ServiceButtons'
import FeatureBlocks from '@/components/FeatureBlocks'
import Banner from '@/components/Banner'
import TransparencySection from '@/components/TransparencySection'
import EnterpriseSection from '@/components/EnterpriseSection'
import StakeholderSolutions from '@/components/StakeholderSolutions'
import JoinTeamBanner from '@/components/JoinTeamBanner'
import ComparisonSection from '@/components/ComparisonSection'
import UtahSummary from '@/components/UtahSummary'
import PlatformSection from '@/components/PlatformSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <AISearchTool />
      <HeroSection />
      <TopSearches />
      <ServiceButtons />
      <FeatureBlocks />
      <Banner />
      <TransparencySection />
      <EnterpriseSection />
      <StakeholderSolutions />
      <PlatformSection />
      <UtahSummary />
      <JoinTeamBanner />
      <ComparisonSection />
      <Footer />
    </main>
  )
}

