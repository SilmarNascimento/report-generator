package com.mateco.reportgenerator.model.repository;

import com.mateco.reportgenerator.model.entity.FileEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileEntity, UUID> {

}
