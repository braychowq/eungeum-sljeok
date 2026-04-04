package com.eungeum.sljeok.backend.auth.repository;

import com.eungeum.sljeok.backend.auth.domain.ConsentType;
import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import com.eungeum.sljeok.backend.auth.entity.UserConsentEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserConsentRepository extends JpaRepository<UserConsentEntity, String> {
  Optional<UserConsentEntity> findByUserAndConsentTypeAndVersion(
      UserEntity user, ConsentType consentType, String version);
}
