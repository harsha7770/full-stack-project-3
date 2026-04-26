package com.mentorship.backend.repository;

import com.mentorship.backend.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Integer> {
    List<Progress> findByMenteeId(Integer menteeId);
}
