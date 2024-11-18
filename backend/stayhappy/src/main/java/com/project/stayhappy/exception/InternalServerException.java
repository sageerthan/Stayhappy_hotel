package com.project.stayhappy.exception;

import java.sql.SQLException;

public class InternalServerException extends Throwable {
    public InternalServerException(String message) {
        super(message);
    }
}
