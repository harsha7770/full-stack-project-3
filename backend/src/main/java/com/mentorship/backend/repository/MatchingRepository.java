package com.mentorship.backend.repository;

import com.mentorship.backend.model.Matching;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchingRepository extends JpaRepository<Matching, Integer> {
    Optional<Matching> findByMentorIdAndMenteeId(Integer mentorId, Integer menteeId);
}
