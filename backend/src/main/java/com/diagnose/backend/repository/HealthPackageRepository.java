package com.diagnose.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.diagnose.backend.entity.HealthPackage;

public interface HealthPackageRepository extends JpaRepository<HealthPackage, Long> {
}
