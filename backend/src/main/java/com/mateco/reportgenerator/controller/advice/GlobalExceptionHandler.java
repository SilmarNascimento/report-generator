package com.mateco.reportgenerator.controller.advice;

import com.mateco.reportgenerator.service.exception.AlreadyExistsException;
import com.mateco.reportgenerator.service.exception.ConflictDataException;
import com.mateco.reportgenerator.service.exception.InvalidDataException;
import com.mateco.reportgenerator.service.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Class - Classe para tratar as exceções lançadas pela aplicação.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Method - Método para tratar a exceção NotFound lançada
   *          pela aplicação.
   *
   * @param exception - exceção capturada pela aplicação.
   * @return - retorna um status HTTP baseado no tipo de
   *           exceção lançada.
   */
  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<String> handleNotFoundException(NotFoundException exception) {
    return ResponseEntity
        .status(HttpStatus.NOT_FOUND)
        .body(exception.getMessage());
  }

  /**
   * Method - Método para tratar a exceção ConflictData lançada
   *          pela aplicação.
   *
   * @param exception - exceção capturada pela aplicação.
   * @return - retorna um status HTTP baseado no tipo de
   *           exceção lançada.
   */
  @ExceptionHandler(AlreadyExistsException.class)
  public ResponseEntity<String> handleAlreadyExistsException(AlreadyExistsException exception) {
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(exception.getMessage());
  }

  /**
   * Method - Método para tratar a exceção ConflictData lançada
   *          pela aplicação.
   *
   * @param exception - exceção capturada pela aplicação.
   * @return - retorna um status HTTP baseado no tipo de
   *           exceção lançada.
   */
  @ExceptionHandler(ConflictDataException.class)
  public ResponseEntity<String> handleConflictDataException(ConflictDataException exception) {
    return ResponseEntity
        .status(HttpStatus.CONFLICT)
        .body(exception.getMessage());
  }

  /**
   * Method - Método para tratar a exceção ConflictData lançada
   *          pela aplicação.
   *
   * @param exception - exceção capturada pela aplicação.
   * @return - retorna um status HTTP baseado no tipo de
   *           exceção lançada.
   */
  @ExceptionHandler(InvalidDataException.class)
  public ResponseEntity<String> handleInvalidDataException(InvalidDataException exception) {
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(exception.getMessage());
  }
}
