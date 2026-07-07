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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicApiController {

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

    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/gallery")
    public ResponseEntity<List<Gallery>> getGalleryImages() {
        return ResponseEntity.ok(galleryRepository.findAll());
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<Testimonial>> getTestimonials() {
        return ResponseEntity.ok(testimonialRepository.findAll());
    }

    @GetMapping("/packages")
    public ResponseEntity<List<HealthPackage>> getPackages() {
        return ResponseEntity.ok(healthPackageRepository.findAll());
    }
}
