import React, { useEffect, useMemo, useState, useCallback } from "react";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Button from "./Button";
import "./GuidedTour.css";

const GuidedTour = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState(null);
  const [targetRect, setTargetRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop tour steps
  const desktopSteps = useMemo(
    () => [
      {
        target: '[data-tour="home"]',
        title: "Welcome to FarmAssist",
        content:
          "This is your smart farming assistant. Click the FarmAssist logo anytime to return home.",
        position: "bottom",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="yield-prediction"]',
        title: "Yield Prediction",
        content:
          "Get accurate crop yield estimates based on your soil type, region, and crop selection. Plan your harvest with confidence.",
        position: "bottom",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="crop-recommendation"]',
        title: "Crop Recommendation",
        content:
          "Find the best crops to grow based on your soil conditions and local climate. Get personalized suggestions.",
        position: "bottom",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="disease-detection"]',
        title: "Disease Detection",
        content:
          "Upload photos of your plants to identify diseases instantly. Get treatment recommendations and save your crops.",
        position: "bottom",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="govt-schemes"]',
        title: "Government Schemes",
        content:
          "Explore various government schemes and subsidies available for farmers. Find financial support for your farming needs.",
        position: "bottom",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="chatbot"]',
        title: "AI Assistant",
        content:
          "Ask questions anytime! The chatbot can help with farming advice in your preferred language. Available 24/7.",
        position: "right",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="help"]',
        title: "Help & Support",
        content:
          "Get help and support for using the FarmAssist platform. Access tutorials and FAQs.",
        position: "right",
        scrollOffset: 100,
      },
      {
        target: '[data-tour="locator"]',
        title: "CSC Locator",
        content:
          "Find nearby Common Service Centers for various government services. Locate the nearest center to you.",
        position: "right",
        scrollOffset: 100,
      },
    ],
    []
  );

  // Mobile tour steps - shorter and focused
  const mobileSteps = useMemo(
    () => [
      {
        target: '[data-tour="home"]',
        title: "Welcome to FarmAssist",
        content:
          "This is your smart farming assistant. Tap the FarmAssist logo to return home anytime.",
        position: "bottom",
        scrollOffset: 100,
        requiresMenu: false,
      },
      {
        target: '[data-tour="mobile-menu-button"]',
        title: "Navigation Menu",
        content:
          "Tap this button to open the navigation menu and access all features like Yield Prediction, Disease Detection, and more.",
        position: "bottom",
        scrollOffset: 100,
        requiresMenu: false,
        onEnter: () => {
          // Open menu when entering this step
          const menuButton = document.querySelector('[data-tour="mobile-menu-button"]');
          if (menuButton && !isMenuOpen) {
            menuButton.click();
            setIsMenuOpen(true);
          }
        },
      },
      {
        target: '[data-tour="yield-prediction"]',
        title: "Yield Prediction",
        content:
          "Predict your crop yields based on soil and weather data. Essential for planning your harvest.",
        position: "bottom",
        scrollOffset: 100,
        requiresMenu: true,
      },
      {
        target: '[data-tour="disease-detection"]',
        title: "Disease Detection",
        content:
          "Take a photo of your plant to identify diseases instantly. Get treatment recommendations to save your crops.",
        position: "bottom",
        scrollOffset: 100,
        requiresMenu: true,
      },
      {
        target: '[data-tour="crop-recommendation"]',
        title: "Crop Recommendation",
        content:
          "Get personalized crop suggestions based on your soil and climate. Find the best crops for your farm.",
        position: "bottom",
        scrollOffset: 100,
        requiresMenu: true,
      },
    ],
    [isMenuOpen]
  );

  // Select steps based on device
  const tourSteps = isMobile ? mobileSteps : desktopSteps;

  // Cleanup function for element highlighting
  const cleanupElement = useCallback((element) => {
    if (element) {
      element.classList.remove("tour-highlight");
      element.style.outline = "";
      element.style.outlineOffset = "";
      element.style.borderRadius = "";
      element.style.zIndex = "";
      element.style.position = "";
    }
  }, []);

  // Safe scroll to element with offset
  const scrollToElement = useCallback((element, offset = 100) => {
    if (!element) return;

    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, []);

  // Find and highlight target element
  useEffect(() => {
    if (!isOpen || currentStep >= tourSteps.length) {
      cleanupElement(targetElement);
      setTargetElement(null);
      setTargetRect(null);
      return;
    }

    const step = tourSteps[currentStep];

    // Skip if no target (shouldn't happen, but safety check)
    if (!step.target) {
      console.warn("Step has no target:", step);
      return;
    }

    // Cleanup previous element
    if (targetElement) {
      cleanupElement(targetElement);
    }

    setIsLoading(true);

    // Handle step-specific actions (like opening menu)
    if (step.onEnter) {
      step.onEnter();
    }

    // For mobile menu items, ensure menu is open
    if (step.requiresMenu && isMobile) {
      const menuButton = document.querySelector('[data-tour="mobile-menu-button"]');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      // Check if menu is actually visible`
      const isMenuVisible = mobileMenu && 
        window.getComputedStyle(mobileMenu).display !== 'none' &&
        mobileMenu.offsetParent !== null;
      
      if (menuButton && !isMenuVisible) {
        menuButton.click();
        setIsMenuOpen(true);
        // Wait longer for menu animation to complete
        setTimeout(() => findElement(), 500);
        return;
      } else if (!isMenuVisible) {
        // Menu should be open but isn't visible, wait a bit more
        setTimeout(() => findElement(), 300);
        return;
      }
    }

    findElement();

    function findElement() {
      // Try to find element with retry logic
      // For mobile menu items, search specifically inside the mobile menu
      let element = null;
      let retries = 0;
      const maxRetries = 5;

      // Define processElement first so it can be called by tryFind
      const processElement = (el) => {
        // Scroll element into view with offset
        scrollToElement(el, step.scrollOffset || 100);

        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          // Wait for scroll to complete
          setTimeout(() => {
            requestAnimationFrame(() => {
              const rect = el.getBoundingClientRect();
              
              // Check if element is visible
              if (rect.width === 0 || rect.height === 0) {
                console.warn("Element has zero dimensions:", step.target);
                setIsLoading(false);
                return;
              }

              // Batch state updates
              setTargetElement(el);
              setTargetRect(rect);
              setIsLoading(false);

              // Add highlight with optimized styles
              el.classList.add("tour-highlight");
              el.style.outline = "3px solid #10B981";
              el.style.outlineOffset = "4px";
              el.style.borderRadius = "8px";
              el.style.zIndex = "1000";
              el.style.position = "relative";
              el.style.willChange = "outline, outline-offset";
              el.style.transform = "translateZ(0)"; // Force GPU acceleration
            });
          }, 300); // Reduced from 400ms
        });
      };

      const tryFind = () => {
        // For mobile menu items, search inside mobile menu container
        if (step.requiresMenu && isMobile) {
          // First, ensure menu is visible
          const mobileMenu = document.querySelector('.mobile-menu');
          const isMenuVisible = mobileMenu && 
            window.getComputedStyle(mobileMenu).display !== 'none' &&
            mobileMenu.offsetParent !== null;
          
          if (!isMenuVisible) {
            console.log('Mobile menu not visible, waiting...');
            if (retries < maxRetries) {
              retries++;
              setTimeout(() => tryFind(), 200);
              return;
            }
          }
          
          if (mobileMenu) {
            // Extract the data-tour value from the selector
            const tourIdMatch = step.target.match(/data-tour="([^"]+)"/);
            const tourId = tourIdMatch ? tourIdMatch[1] : null;
            
            if (tourId) {
              // Search specifically for mobile-nav-link elements with the matching data-tour attribute
              const navLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
              navLinks.forEach(link => {
                if (link.getAttribute('data-tour') === tourId) {
                  element = link;
                }
              });
            }
            
            // Fallback: search inside mobile menu for the specific data-tour attribute
            if (!element) {
              element = mobileMenu.querySelector(step.target);
              // Make sure it's a mobile-nav-link
              if (element && !element.classList.contains('mobile-nav-link')) {
                element = null;
              }
            }
          }
        } else {
          // For other elements, use standard querySelector
          element = document.querySelector(step.target);
        }

        // Exclude the menu button itself if we're looking for menu items
        if (element && step.requiresMenu && isMobile) {
          const menuButton = document.querySelector('[data-tour="mobile-menu-button"]');
          // Only accept elements that are mobile-nav-link, not the button or controls
          if (element.closest('.mobile-menu-toggle') || 
              element === menuButton || 
              element.closest('.navbar-controls') ||
              !element.classList.contains('mobile-nav-link')) {
            console.log('Excluding element (not a mobile-nav-link):', element);
            element = null;
          } else {
            console.log('Found valid mobile menu item:', element);
          }
        }

        if (!element && retries < maxRetries) {
          retries++;
          setTimeout(() => {
            tryFind();
          }, 200);
        } else if (element) {
          processElement(element);
        } else {
          console.warn(`Tour target not found after ${maxRetries} retries: ${step.target}`);
          setIsLoading(false);
          // Skip to next step if element not found
          if (currentStep < tourSteps.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 500);
          } else {
            onClose();
          }
        }
      };

      // Start the search
      tryFind();
    }
  }, [isOpen, currentStep, tourSteps, targetElement, isMobile, isMenuOpen, cleanupElement, scrollToElement, onClose]);

  // Update target rect on resize/scroll - optimized with requestAnimationFrame
  useEffect(() => {
    if (!targetElement) return;

    let rafId = null;
    let ticking = false;

    const updateRect = () => {
      if (targetElement && !ticking) {
        ticking = true;
        rafId = requestAnimationFrame(() => {
          const rect = targetElement.getBoundingClientRect();
          setTargetRect(rect);
          ticking = false;
        });
      }
    };

    // Throttled scroll/resize handlers
    const handleResize = () => updateRect();
    const handleScroll = () => updateRect();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [targetElement]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      cleanupElement(targetElement);
    };
  }, [targetElement, cleanupElement]);

  // Reset tour when closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      cleanupElement(targetElement);
      setTargetElement(null);
      setTargetRect(null);
      setIsMenuOpen(false);
      setIsLoading(false);
    }
  }, [isOpen, targetElement, cleanupElement]);

  // Prevent body scroll when tour is open (but allow scrolling to elements)
  useEffect(() => {
    if (isOpen) {
      // Don't lock scroll completely, just prevent accidental scrolling
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentStep, tourSteps.length, onClose]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Calculate tooltip position
  const getTooltipStyle = () => {
    if (!targetRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    const step = tourSteps[currentStep];
    const tooltipWidth = isMobile ? Math.min(320, window.innerWidth - 32) : 320;
    const tooltipHeight = isMobile ? 280 : 250;
    const gap = 16;
    const navbarHeight = 80;
    
    let top, left;
    
    // Mobile: prefer bottom or center
    if (isMobile) {
      // Try bottom first
      top = targetRect.bottom + gap;
      left = Math.max(16, targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2));
      
      // If goes off bottom, try top
      if (top + tooltipHeight > window.innerHeight - 16) {
        top = targetRect.top - tooltipHeight - gap;
      }
      
      // If still off screen, center it
      if (top < navbarHeight) {
        top = Math.max(navbarHeight + 16, (window.innerHeight - tooltipHeight) / 2);
      }
      
      // Ensure it doesn't go off screen horizontally
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
    } else {
      // Desktop: use step position preference
      switch (step.position) {
        case "right":
          left = targetRect.right + gap;
          top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
          if (left + tooltipWidth > window.innerWidth - 16) {
            left = targetRect.left - tooltipWidth - gap;
          }
          break;
        case "left":
          left = targetRect.left - tooltipWidth - gap;
          top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
          if (left < 16) {
            left = targetRect.right + gap;
          }
          break;
        case "bottom":
          top = targetRect.bottom + gap;
          left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
          if (top + tooltipHeight > window.innerHeight - 16) {
            top = targetRect.top - tooltipHeight - gap;
          }
          break;
        case "top":
          top = targetRect.top - tooltipHeight - gap;
          left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
          if (top < navbarHeight) {
            top = targetRect.bottom + gap;
          }
          break;
        default:
          left = targetRect.right + gap;
          top = targetRect.top + (targetRect.height / 2) - (tooltipHeight / 2);
      }
      
      // Final boundary checks
      left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));
      top = Math.max(navbarHeight + 16, Math.min(top, window.innerHeight - tooltipHeight - 16));
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      position: "fixed",
      zIndex: 1002,
      transform: "translateZ(0)", // Force GPU acceleration
      willChange: "transform, opacity",
    };
  };

  if (!isOpen || currentStep >= tourSteps.length) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="guided-tour-overlay">
      {/* Backdrop */}
      <div
        className="guided-tour-backdrop"
        onClick={onClose}
      />

      {/* Highlight ring - memoized for performance */}
      {targetRect && !isLoading && (() => {
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const ellipseWidth = Math.max(targetRect.width + 40, 100);
        const ellipseHeight = Math.max(targetRect.height + 40, 100);
        
        return (
          <>
            {/* Dark overlay with cutout - optimized gradient */}
            <div
              className="guided-tour-overlay-cutout"
              style={{
                background: `radial-gradient(ellipse ${ellipseWidth}px ${ellipseHeight}px at ${centerX}px ${centerY}px, transparent 0%, transparent 35%, rgba(0, 0, 0, 0.55) 65%)`,
              }}
            />
            {/* Border highlight - smooth transitions */}
            <div
              className="guided-tour-highlight-border"
              style={{
                top: `${targetRect.top - 4}px`,
                left: `${targetRect.left - 4}px`,
                width: `${targetRect.width + 8}px`,
                height: `${targetRect.height + 8}px`,
              }}
            />
          </>
        );
      })()}

      {/* Tooltip */}
      <div
        className={`guided-tour-tooltip ${isMobile ? "mobile" : ""}`}
        style={getTooltipStyle()}
      >
        <div className="guided-tour-tooltip-header">
          <h3 className="guided-tour-tooltip-title">{step.title}</h3>
          <button
            onClick={onClose}
            className="guided-tour-close-button"
            aria-label="Close tour"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="guided-tour-tooltip-content">{step.content}</p>

        <div className="guided-tour-tooltip-footer">
          <div className="guided-tour-progress-text">
            {currentStep + 1} of {tourSteps.length}
          </div>

          <div className="guided-tour-buttons">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size={isMobile ? "md" : "sm"}
                onClick={prevStep}
                className="guided-tour-button"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}

            <Button
              variant="primary"
              size={isMobile ? "md" : "sm"}
              onClick={nextStep}
              className="guided-tour-button"
            >
              {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
              {currentStep < tourSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="guided-tour-progress-bar">
          <div
            className="guided-tour-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
