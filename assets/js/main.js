document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const btn = document.getElementById("btn");
  const links = document.querySelector(".links");
  const linkItems = document.querySelectorAll(".links a");

  btn.addEventListener("click", function () {
    links.classList.toggle("show");
  });

  // Smooth Scrolling for Navigation Links
  linkItems.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
      linkItems.forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Initialize Swiper (Horizontal Auto-play)
  const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    speed: 200,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // Intersection Observer for Section Animation (Entrance and Exit)
  const animatedSections = document.querySelectorAll(".animate-section");
  const observerOptions = {
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Alternate animation direction for variety:
        if (index % 2 === 0) {
          entry.target.classList.remove("right", "animate-out");
        } else {
          entry.target.classList.add("right");
          entry.target.classList.remove("animate-out");
        }
        entry.target.classList.add("animate-in");
      } else {
        entry.target.classList.remove("animate-in");
        entry.target.classList.add("animate-out");
      }
    });
  }, observerOptions);

  animatedSections.forEach((section) => {
    observer.observe(section);
  });

  // Contact Form Submission using Formspree
  const form = document.getElementById("contact-form");

  // Simple sanitization to mitigate XSS risks
  function sanitize(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Retrieve and trim form values
    let name = form.elements["name"].value.trim();
    let email = form.elements["email"].value.trim();
    let phone = form.elements["phone"].value.trim();
    let message = form.elements["message"].value.trim();

    // Validate Name (letters and spaces only)
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      alert("Please enter a valid name (letters and spaces only).");
      return;
    }
    // Validate Email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    // Validate Phone if provided
    if (phone !== "" && !/^\+?[0-9]{7,15}$/.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    // Validate Message length (minimum 5 characters)
    if (message.length < 5) {
      alert("Your message must be at least 5 characters long.");
      return;
    }

    // Sanitize input values
    name = sanitize(name);
    email = sanitize(email);
    phone = sanitize(phone);
    message = sanitize(message);

    const data = { name, email, phone, message };

    // Send data via Formspree (replace with your actual Formspree endpoint)
    fetch("https://formspree.io/f/mdkoopwr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          alert(
            "Thank you for reaching out to us! We will get back to you soon."
          );
          form.reset();
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        alert(
          "There was an error sending your message. Please try again later."
        );
      });
  });

  // Auto-update Copyright Year
  const yearSpan = document.getElementById("year");
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear;
});
