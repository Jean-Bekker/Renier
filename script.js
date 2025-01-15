document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhanced scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll('.objective-card, .step, .partnership-card, .challenge-card').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
  });

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.documentElement.style.setProperty('--scroll-width', `${scrolled}%`);
  });

  // Enhanced nav link animations
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'scale(1.1)';
      link.style.color = 'var(--primary)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'scale(1)';
      link.style.color = 'var(--text)';
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  const dotsContainer = document.querySelector('.slide-dots');
  
  let currentSlide = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slide-dot');
    if (index === 0) {
      dot.classList.add('active');
      slides[0].classList.add('active');
    }
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slide-dot');

  function updateProgress() {
    const progress = ((currentSlide + 1) / slides.length) * 100;
    document.documentElement.style.setProperty('--progress', `${progress}%`);
  }

  // Update base slide animation function for better responsiveness
  function animateSlideContent() {
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
      const content = activeSlide.querySelectorAll('.fade-up');
      content.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('visible');
        }, index * 100);
      });
    }
  }

  // Enhance goToSlide function for better transitions
  function goToSlide(index) {
    // Reset animations on previous slide
    document.querySelectorAll('.fade-up.visible').forEach(el => {
      el.classList.remove('visible');
    });

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    updateProgress();

    // Trigger new animations
    setTimeout(animateSlideContent, 100);

    // Update navigation states
    prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentSlide === slides.length - 1 ? '0.5' : '1';

    // Update mobile class if content exceeds viewport
    const activeSlide = slides[currentSlide];
    const content = activeSlide.querySelector('.slide-content');
    if (content && content.scrollHeight > window.innerHeight) {
      activeSlide.classList.add('mobile-scroll');
    } else {
      activeSlide.classList.remove('mobile-scroll');
    }
  }

  // Navigation
  nextBtn.addEventListener('click', () => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      if (currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0 && currentSlide < slides.length - 1) {
        goToSlide(currentSlide + 1);
      } else if (difference < 0 && currentSlide > 0) {
        goToSlide(currentSlide - 1);
      }
    }
  }

  // Initialize first slide and progress
  // Initialize slider functionality
  if (slides.length > 0) {
    goToSlide(0);
  }

  // Add animation to elements when they become visible
  function animateOnVisible(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }

  const fadeObserver = new IntersectionObserver(animateOnVisible, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all content elements for fade animation
  document.querySelectorAll('.slide-content > *').forEach(element => {
    fadeObserver.observe(element);
  });

  // Enhanced chart configurations
  const marketChartConfig = {
    type: 'doughnut',
    data: {
      labels: ['Current Market', 'Expansion Target', 'Future Potential'],
      datasets: [{
        data: [30, 45, 25],
        backgroundColor: [
          '#2563eb',
          '#f59e0b',
          '#10b981'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#ffffff',
            font: {
              size: 14
            },
            padding: 20
          }
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };

  const dealsChartConfig = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Deal Progress',
        data: [65, 59, 80, 81, 56, 95],
        fill: true,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const prospectsChartConfig = {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'New Prospects',
        data: [120, 190, 150, 220],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const referralSourcesConfig = {
    type: 'pie',
    data: {
      labels: ['Direct Network', 'Partner Referrals', 'Customer Referrals', 'Events'],
      datasets: [{
        data: [40, 25, 20, 15],
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#8b5cf6'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ffffff',
            padding: 10
          }
        }
      }
    }
  };

  const pricingComparisonConfig = {
    type: 'bar',
    data: {
      labels: ['Basic', 'Premium', 'Enterprise'],
      datasets: [
        {
          label: 'Our Price',
          data: [100, 200, 300],
          backgroundColor: '#3b82f6'
        },
        {
          label: 'Competitor Avg',
          data: [80, 180, 280],
          backgroundColor: '#f59e0b'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const salesCycleConfig = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Average Sales Cycle (Days)',
        data: [90, 85, 82, 78, 75, 70],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const satisfactionTrendConfig = {
    type: 'line',
    data: {
      labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Customer Satisfaction Score',
        data: [85, 87, 86, 89, 91, 92],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 80,
          max: 100,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const initiativesTimelineConfig = {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Planned Initiatives',
        data: [4, 6, 5, 7],
        backgroundColor: '#10b981',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff',
            stepSize: 1
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const competitorAnalysisConfig = {
    type: 'radar',
    data: {
      labels: ['Price', 'Features', 'Support', 'Integration', 'Security', 'Usability'],
      datasets: [{
        label: 'Our Product',
        data: [85, 90, 88, 87, 92, 85],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)'
      }, {
        label: 'Competitor Avg',
        data: [82, 85, 80, 85, 88, 82],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#ffffff'
          }
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            color: '#ffffff'
          },
          ticks: {
            color: '#ffffff',
            backdropColor: 'transparent'
          }
        }
      }
    }
  };

  const targetingSectorConfig = {
    type: 'doughnut',
    data: {
      labels: ['Technology', 'Healthcare', 'Education', 'Finance', 'Manufacturing'],
      datasets: [{
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ef4444'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const visitsScheduleConfig = {
    type: 'bar',
    data: {
      labels: ['Mar', 'Apr', 'Jun'],
      datasets: [{
        label: 'Planned Visits',
        data: [5, 8, 6],
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const objectivesProgressConfig = {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Planned'],
      datasets: [{
        data: [35, 45, 20],
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const productRoadmapConfig = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Product Launches',
        data: [2, 3, 2, 4, 3, 5],
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const innovationTrackingConfig = {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'New Features',
        data: [8, 12, 10, 15],
        backgroundColor: '#10b981',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const customerTrendsConfig = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Customer Growth',
        data: [100, 120, 150, 170, 200, 230],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const upsellingConfig = {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Upselling Revenue',
        data: [50000, 75000, 90000, 120000],
        backgroundColor: '#f59e0b',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const executiveSupportConfig = {
    type: 'pie',
    data: {
      labels: ['Direct Involvement', 'Strategic Support', 'Resource Allocation'],
      datasets: [{
        data: [40, 35, 25],
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#10b981'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const trainingProgressConfig = {
    type: 'bar',
    data: {
      labels: ['Sales Skills', 'Product Knowledge', 'Industry Expertise', 'Technical Skills'],
      datasets: [{
        label: 'Training Progress',
        data: [85, 90, 75, 80],
        backgroundColor: '#8b5cf6',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const aiToolsConfig = {
    type: 'doughnut',
    data: {
      labels: ['Lead Scoring', 'Market Analysis', 'Predictive Analytics', 'Automation'],
      datasets: [{
        data: [30, 25, 25, 20],
        backgroundColor: [
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#8b5cf6'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  const sustainabilityConfig = {
    type: 'radar',
    data: {
      labels: ['Energy Efficiency', 'Waste Reduction', 'Green Products', 'Carbon Footprint', 'Sustainable Practices'],
      datasets: [{
        label: 'Current Status',
        data: [80, 75, 85, 70, 90],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        r: {
          angleLines: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          pointLabels: {
            color: '#ffffff'
          },
          ticks: {
            color: '#ffffff',
            backdropColor: 'transparent'
          }
        }
      }
    }
  };

  const eventsTimelineConfig = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Planned Events',
        data: [2, 3, 4, 3, 5, 4],
        backgroundColor: '#a855f7',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#ffffff'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#ffffff'
          }
        }
      }
    }
  };

  // Initialize charts only if elements exist
  function initializeChart(elementId, config) {
    const element = document.getElementById(elementId);
    if (element) {
      return new Chart(element, config);
    }
    return null;
  }

  // Chart initializations
  const charts = {
    marketChart: initializeChart('marketChart', marketChartConfig),
    dealsChart: initializeChart('dealsChart', dealsChartConfig),
    prospectsChart: initializeChart('prospectsChart', prospectsChartConfig),
    referralSourcesChart: initializeChart('referralSourcesChart', referralSourcesConfig),
    pricingComparisonChart: initializeChart('pricingComparisonChart', pricingComparisonConfig),
    salesCycleChart: initializeChart('salesCycleChart', salesCycleConfig),
    satisfactionTrendChart: initializeChart('satisfactionTrendChart', satisfactionTrendConfig),
    initiativesTimelineChart: initializeChart('initiativesTimelineChart', initiativesTimelineConfig),
    competitorAnalysisChart: initializeChart('competitorAnalysisChart', competitorAnalysisConfig),
    targetingSectorChart: initializeChart('targetingSectorChart', targetingSectorConfig),
    visitsScheduleChart: initializeChart('visitsScheduleChart', visitsScheduleConfig),
    objectivesProgressChart: initializeChart('objectivesProgressChart', objectivesProgressConfig),
    productRoadmapChart: initializeChart('productRoadmapChart', productRoadmapConfig),
    innovationTrackingChart: initializeChart('innovationTrackingChart', innovationTrackingConfig),
    customerTrendsChart: initializeChart('customerTrendsChart', customerTrendsConfig),
    upsellingChart: initializeChart('upsellingChart', upsellingConfig),
    executiveSupportChart: initializeChart('executiveSupportChart', executiveSupportConfig),
    trainingProgressChart: initializeChart('trainingProgressChart', trainingProgressConfig),
    aiToolsChart: initializeChart('aiToolsChart', aiToolsConfig),
    sustainabilityChart: initializeChart('sustainabilityChart', sustainabilityConfig),
    eventsTimelineChart: initializeChart('eventsTimelineChart', eventsTimelineConfig)
  };

  // Enhanced animations for elements
  const animateElements = () => {
    const elements = document.querySelectorAll('.hover-card, .icon-pulse');
    elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      
      if (isVisible) {
        element.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', animateElements);
  animateElements();

  // Enhanced animations for cards
  const cards = document.querySelectorAll('.hover-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'none';
    });
  });

  // Add hover effects for gradient borders
  document.querySelectorAll('.gradient-border').forEach(border => {
    border.addEventListener('mouseenter', () => {
      border.style.transform = 'scale(1.02)';
      border.style.transition = 'transform 0.3s ease';
    });
    
    border.addEventListener('mouseleave', () => {
      border.style.transform = 'scale(1)';
    });
  });

  // Auto-resize text to fit containers
  function resizeText() {
    document.querySelectorAll('.slide-content h1, .slide-content h2').forEach(text => {
      let fontSize = 4;
      text.style.fontSize = fontSize + 'rem';
      
      while (text.scrollWidth > text.offsetWidth || text.scrollHeight > text.offsetHeight) {
        fontSize -= 0.1;
        text.style.fontSize = fontSize + 'rem';
      }
    });
  }

  window.addEventListener('resize', resizeText);
  resizeText();

  // Add responsive checks
  function handleResize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  
    // Adjust font sizes for mobile
    if (window.innerWidth < 768) {
      document.documentElement.style.setProperty('--header-size', '2rem');
      document.documentElement.style.setProperty('--subheader-size', '1.5rem');
    } else {
      document.documentElement.style.setProperty('--header-size', '3rem');
      document.documentElement.style.setProperty('--subheader-size', '2rem');
    }
  }

  // Initialize responsive features
  window.addEventListener('resize', handleResize);
  handleResize();
});
