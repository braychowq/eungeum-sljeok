package com.eungeum.sljeok.backend.auth.repository;

import com.eungeum.sljeok.backend.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, String> {}
