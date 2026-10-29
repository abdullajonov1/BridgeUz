import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CompareProvider } from './lib/compare'
import { DataProvider } from './lib/store'
import Home from './pages/Home'
import Regions from './pages/Regions'
import RegionDetail from './pages/RegionDetail'
import Opportunities from './pages/Opportunities'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Services from './pages/Services'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Apply from './pages/Apply'
import Search from './pages/Search'
import NotFound from './pages/NotFound'
import { AdminLayout } from './admin/AdminLayout'
import AdminLogin from './admin/Login'
import Dashboard from './admin/Dashboard'
import AdminApplications from './admin/Applications'
import AdminCompanies from './admin/Companies'
import AdminOpportunities from './admin/Opportunities'
import AdminRegions from './admin/Regions'
import AdminPayments from './admin/Payments'

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <CompareProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="hududlar" element={<Regions />} />
              <Route path="hududlar/:slug" element={<RegionDetail />} />
              <Route path="imkoniyatlar" element={<Opportunities />} />
              <Route path="kompaniyalar" element={<Companies />} />
              <Route path="kompaniyalar/:id" element={<CompanyDetail />} />
              <Route path="xizmatlar" element={<Services />} />
              <Route path="narxlar" element={<Pricing />} />
              <Route path="biz-haqimizda" element={<About />} />
              <Route path="murojaat" element={<Apply />} />
              <Route path="qidiruv" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="admin/kirish" element={<AdminLogin />} />
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="murojaatlar" element={<AdminApplications />} />
              <Route path="kompaniyalar" element={<AdminCompanies />} />
              <Route path="loyihalar" element={<AdminOpportunities />} />
              <Route path="hududlar" element={<AdminRegions />} />
              <Route path="moliya" element={<AdminPayments />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CompareProvider>
      </DataProvider>
    </BrowserRouter>
  )
}
