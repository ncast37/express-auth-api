import { useEffect, useState } from 'react';

// Custom hook for mobile-friendly form handling
export const useMobileFormOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|iPhone|iPad|iPod|blackberry|iemobile|opera mini/i.test(userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      
      setIsMobile(isMobileDevice || (hasTouch && isSmallScreen));
    };

    // Detect orientation
    const checkOrientation = () => {
      if (window.screen && window.screen.orientation) {
        setOrientation(window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180 ? 'portrait' : 'landscape');
      } else {
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      }
    };

    // Detect virtual keyboard (iOS Safari)
    const handleViewportChange = () => {
      if (isMobile) {
        const initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const currentViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const heightDifference = initialViewportHeight - currentViewportHeight;
        
        // If viewport height decreased significantly, keyboard is likely open
        setKeyboardOpen(heightDifference > 150);
      }
    };

    checkMobile();
    checkOrientation();

    // Event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkOrientation);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkOrientation);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, [isMobile]);

  return {
    isMobile,
    orientation,
    keyboardOpen,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
};

// Utility function to prevent body scroll when modal/form is open
export const usePreventBodyScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = '';
      };
    }
  }, [isOpen]);
};

// Utility function for smooth scroll to element (mobile-friendly)
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const yPosition = element.offsetTop - offset;
    window.scrollTo({
      top: yPosition,
      behavior: 'smooth'
    });
  }
};

// Focus management for mobile forms
export const useFocusManagement = () => {
  const focusFirstError = (formRef) => {
    if (formRef.current) {
      const firstErrorElement = formRef.current.querySelector('.form-input.error');
      if (firstErrorElement) {
        firstErrorElement.focus();
        // Scroll into view with mobile-friendly offset
        setTimeout(() => {
          firstErrorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      }
    }
  };

  const focusNextField = (currentFieldName, fieldOrder) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    if (currentIndex >= 0 && currentIndex < fieldOrder.length - 1) {
      const nextFieldName = fieldOrder[currentIndex + 1];
      const nextField = document.querySelector(`[name="${nextFieldName}"]`);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return {
    focusFirstError,
    focusNextField
  };
};
