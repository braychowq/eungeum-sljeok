package com.eungeum.sljeok.backend.auth.repository;

import com.eungeum.sljeok.backend.auth.entity.AuthSessionEntity;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthSessionRepository extends JpaRepository<AuthSessionEntity, String> {
  Optional<AuthSessionEntity> findBySessionTokenHashAndRevokedAtIsNull(String sessionTokenHash);

  List<AuthSessionEntity> findAllByUser_IdAndRevokedAtIsNull(String userId);

  void deleteByExpiresAtBefore(Instant cutoff);
}
