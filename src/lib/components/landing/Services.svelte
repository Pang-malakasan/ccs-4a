<script lang="ts">
  import ServiceSlides from "./ServiceSlides.svelte";
  const services = [
    {
      number: "01",
      title: "Web Design & Development",
      description:
        "Digital experiences built to make a lasting first impression and turn visitors into customers.",
      offerings: [
        "Corporate websites",
        "eCommerce",
        "UI/UX design",
        "Landing pages",
        "Maintenance & hosting",
      ],
      theme: "web",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996544/developers.jpg",
    },
    {
      number: "02",
      title: "Digital Marketing",
      description:
        "Get found, build momentum, and make every interaction count.",
      offerings: [
        "SEO",
        "PPC advertising",
        "Social media",
        "Content & copywriting",
        "Email marketing",
      ],
      theme: "marketing",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996544/marketing.jpg",
    },
    {
      number: "03",
      title: "Branding & Strategy",
      description:
        "A distinctive point of view that stays with people across every touchpoint.",
      offerings: ["Brand identity", "Strategy & positioning", "Rebranding"],
      theme: "branding",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996542/branding.jpg",
    },
    {
      number: "04",
      title: "Multimedia & Creative",
      description: "Visual stories that are impossible to scroll past.",
      offerings: [
        "Video production",
        "Photography",
        "Motion graphics & animation",
      ],
      theme: "creative",
      image:
        "https://res.cloudinary.com/lremvhvs/image/upload/v1791996543/multimedia.jpg",
    },
  ];
</script>

<section id="services" aria-labelledby="services-title" class="services-section">
  <ServiceSlides {services} />
</section>

<style>
  .services-section { background: #000; color: #fff; scroll-margin-top: 0; }
</style>
