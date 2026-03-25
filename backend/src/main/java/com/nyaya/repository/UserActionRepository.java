package com.nyaya.repository;

import com.nyaya.entity.UserAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserActionRepository extends JpaRepository<UserAction, Long> {

    List<UserAction> findByActionTypeOrderByTimestampDesc(String actionType);

    List<UserAction> findByStateIgnoreCaseOrderByTimestampDesc(String state);
}
