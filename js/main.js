// Animation d'apparition au défilement
document.addEventListener('DOMContentLoaded', function() {
  // Sélectionner tous les éléments avec la classe fade-in
  const fadeElements = document.querySelectorAll('.fade-in');
  
  // Fonction pour vérifier si un élément est dans la vue et ajouter la classe visible
  const fadeInOnScroll = function() {
    for (let i = 0; i < fadeElements.length; i++) {
      const elem = fadeElements[i];
      const distInView = elem.getBoundingClientRect().top - window.innerHeight + 100;
      
      if (distInView < 0) {
        elem.classList.add('visible');
      }
    }
  };
  
  // Navigation smooth scroll
  const navLinks = document.querySelectorAll('nav a, .hero a, .toulouse-link, .cta a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Ne pas suivre le lien par défaut
      e.preventDefault();
      
      // Récupérer la cible du lien (l'ID de l'élément cible)
      const targetId = this.getAttribute('href');
      
      // Si le lien est un lien interne (commence par #)
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Défiler en douceur vers l'élément cible
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Ajuster pour le header fixe
            behavior: 'smooth'
          });
          
          // Mettre à jour la classe active dans la navigation
          document.querySelectorAll('nav a').forEach(navLink => {
            navLink.classList.remove('active');
          });
          
          // Si le lien cliqué est dans la navigation, ajouter la classe active
          if (this.parentElement.tagName === 'NAV') {
            this.classList.add('active');
          }
        }
      }
    });
  });
  
  // Mise à jour de la navigation active au défilement
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
    
    // Appeler la fonction fadeInOnScroll
    fadeInOnScroll();
  });
  
  // Vérifier au chargement
  fadeInOnScroll();
  
  // Animation des statistiques pour l'effet de comptage
  const statItems = document.querySelectorAll('.stat-item h3');
  
  const animateStats = function() {
    statItems.forEach(stat => {
      // Valeur finale à atteindre
      const targetValue = parseInt(stat.textContent.replace(/,/g, ''), 10);
      
      // Fonction pour animer le comptage
      const countUp = function(target, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const value = Math.floor(progress * (end - start) + start);
          
          // Formater le nombre avec des espaces pour les milliers
          target.textContent = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      };
      
      // Observer l'élément pour démarrer l'animation lorsqu'il est visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Commencer à 0 et aller jusqu'à la valeur cible sur 2 secondes
            countUp(stat, 0, targetValue, 2000);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(stat);
    });
  };
  
  // Appeler la fonction d'animation des statistiques si la section existe
  if (statItems.length > 0) {
    animateStats();
  }
});