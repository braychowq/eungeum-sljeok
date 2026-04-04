package com.eungeum.sljeok.backend.auth.repository;

import com.eungeum.sljeok.backend.auth.domain.SocialProvider;
import com.eungeum.sljeok.backend.auth.entity.SocialAccountEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialAccountRepository extends JpaRepository<SocialAccountEntity, String> {
  Optional<SocialAccountEntity> findByProviderAndProviderUserId(
      SocialProvider provider, String providerUserId);
}
