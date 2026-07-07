package com.diagnose.backend.controller;

import com.diagnose.backend.entity.Booking;
import com.diagnose.backend.entity.Doctor;
import com.diagnose.backend.entity.Gallery;
import com.diagnose.backend.entity.Testimonial;
import com.diagnose.backend.repository.BookingRepository;
import com.diagnose.backend.repository.DoctorRepository;
import com.diagnose.backend.repository.GalleryRepository;
import com.diagnose.backend.repository.TestimonialRepository;
import com.diagnose.backend.entity.HealthPackage;
import com.diagnose.backend.repository.HealthPackageRepository;
import com.diagnose.backend.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminApiController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private GalleryRepository galleryRepository;

    @Autowired
    private TestimonialRepository testimonialRepository;

    @Autowired
    private HealthPackageRepository healthPackageRepository;

    @Autowired
    private ImageStorageService imageStorageService;

    // --- Bookings ---
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
    
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Doctors ---
    @PostMapping("/doctors")
    public ResponseEntity<Doctor> addDoctor(@RequestParam("name") String name,
                                            @RequestParam("specialization") String specialization,
                                            @RequestParam("yearsOfExperience") String yearsOfExperience,
                                            @RequestParam(value = "image", required = false) MultipartFile image) {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctor.setYearsOfExperience(yearsOfExperience);
        
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.storeFile(image);
            doctor.setImageUrl(imageUrl);
        }
        
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }
    
    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Gallery ---
    @PostMapping("/gallery")
    public ResponseEntity<Gallery> addGalleryImage(@RequestParam("altText") String altText,
                                                   @RequestParam("image") MultipartFile image) {
        Gallery gallery = new Gallery();
        gallery.setAltText(altText);
        
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.storeFile(image);
            gallery.setImageUrl(imageUrl);
        }
        
        return ResponseEntity.ok(galleryRepository.save(gallery));
    }
    
    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<Void> deleteGalleryImage(@PathVariable Long id) {
        galleryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Testimonials ---
    @PostMapping("/testimonials")
    public ResponseEntity<Testimonial> addTestimonial(@RequestParam("patientName") String patientName,
                                                      @RequestParam("quote") String quote,
                                                      @RequestParam("starRating") int starRating,
                                                      @RequestParam(value = "image", required = false) MultipartFile image) {
        Testimonial testimonial = new Testimonial();
        testimonial.setPatientName(patientName);
        testimonial.setQuote(quote);
        testimonial.setStarRating(starRating);
        
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.storeFile(image);
            testimonial.setImageUrl(imageUrl);
        }
        
        return ResponseEntity.ok(testimonialRepository.save(testimonial));
    }
    
    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Long id) {
        testimonialRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // --- Health Packages ---
    @PostMapping("/packages")
    public ResponseEntity<HealthPackage> addPackage(@RequestParam("title") String title,
                                                    @RequestParam("price") String price,
                                                    @RequestParam("features") String features,
                                                    @RequestParam(value = "isPremium", defaultValue = "false") boolean isPremium) {
        HealthPackage hp = new HealthPackage();
        hp.setTitle(title);
        hp.setPrice(price);
        hp.setFeatures(features);
        hp.setPremium(isPremium);
        return ResponseEntity.ok(healthPackageRepository.save(hp));
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        healthPackageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
