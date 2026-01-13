import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Sprout,
  Shield,
  Building2,
  MessageCircle,
  HelpCircle,
  Menu,
  X,
  MapPin,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import "./Layout.css";

const Layout = () => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: t("yieldPrediction"),
      href: "/yield-prediction",
      icon: TrendingUp,
      tourId: "yield-prediction",
    },
    {
      name: t("cropRecommendation"),
      href: "/crop-recommendation",
      icon: Sprout,
      tourId: "crop-recommendation",
    },
    {
      name: t("diseaseDetection"),
      href: "/disease-detection",
      icon: Shield,
      tourId: "disease-detection",
    },
    {
      name: t("govtSchemes"),
      href: "/govt-schemes",
      icon: Building2,
      tourId: "govt-schemes",
    },
    {
      name: t("chatbot"),
      href: "/chatbot",
      icon: MessageCircle,
      tourId: "chatbot",
    },
    {
      name: t("help"),
      href: "/help",
      icon: HelpCircle,
      tourId: "help",
    },
    {
      name: t("Locator"),
      href: "/csc-locator",
      icon: MapPin,
      tourId: "locator",
    },
  ];

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="layout-wrapper">
      {/* Top Capsule Navbar */}
      <nav className={`capsule-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo" data-tour="home">
            <Sprout className="logo-icon" />
            <span className="logo-text">FarmAssist</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links-desktop">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                  data-tour={item.tourId}
                >
                  <Icon className="nav-link-icon" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Controls */}
          <div className="navbar-controls">
            <ThemeToggle />
            <div className="language-switcher-wrapper">
              <LanguageSwitcher />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-toggle"
              aria-label="Toggle menu"
              data-tour="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav-links">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mobile-nav-link ${isActive ? "active" : ""}`}
                    data-tour={item.tourId}
                  >
                    <Icon className="mobile-nav-icon" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </nav>

      {/* Main Content - Full Width */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
