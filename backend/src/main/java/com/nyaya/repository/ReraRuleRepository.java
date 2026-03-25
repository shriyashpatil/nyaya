package com.nyaya.repository;

import com.nyaya.entity.ReraRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReraRuleRepository extends JpaRepository<ReraRule, Long> {

    List<ReraRule> findByStateIgnoreCase(String state);

    Optional<ReraRule> findByRuleId(String ruleId);

    @Query("SELECT r FROM ReraRule r WHERE LOWER(r.state) = LOWER(:state) ORDER BY r.ruleId")
    List<ReraRule> findRulesByState(@Param("state") String state);

    @Query("SELECT r FROM ReraRule r WHERE LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<ReraRule> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT r.state FROM ReraRule r ORDER BY r.state")
    List<String> findAllStates();

    boolean existsByRuleId(String ruleId);
}
