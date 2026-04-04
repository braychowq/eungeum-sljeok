package com.eungeum.sljeok.backend.auth.repository;

import com.eungeum.sljeok.backend.auth.entity.OAuthLoginStateEntity;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OAuthLoginStateRepository extends JpaRepository<OAuthLoginStateEntity, String> {
  Optional<OAuthLoginStateEntity> findByStateToken(String stateToken);

  void deleteByExpiresAtBefore(Instant cutoff);
}
