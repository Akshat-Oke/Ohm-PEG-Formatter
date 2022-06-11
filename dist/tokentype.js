export var TokenType;
(function (TokenType) {
    TokenType[TokenType["LEFT_PAREN"] = 0] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 1] = "RIGHT_PAREN";
    TokenType[TokenType["LEFT_BRACE"] = 2] = "LEFT_BRACE";
    TokenType[TokenType["RIGHT_BRACE"] = 3] = "RIGHT_BRACE";
    TokenType[TokenType["MINUS"] = 4] = "MINUS";
    TokenType[TokenType["PLUS"] = 5] = "PLUS";
    TokenType[TokenType["COMMA"] = 6] = "COMMA";
    TokenType[TokenType["SEMICOLON"] = 7] = "SEMICOLON";
    TokenType[TokenType["SLASH"] = 8] = "SLASH";
    TokenType[TokenType["STAR"] = 9] = "STAR";
    TokenType[TokenType["EQUAL"] = 10] = "EQUAL";
    TokenType[TokenType["NOT_EQUAL"] = 11] = "NOT_EQUAL";
    TokenType[TokenType["GREATER"] = 12] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 13] = "GREATER_EQUAL";
    TokenType[TokenType["LESS"] = 14] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 15] = "LESS_EQUAL";
    TokenType[TokenType["ARROW"] = 16] = "ARROW";
    TokenType[TokenType["CARET"] = 17] = "CARET";
    TokenType[TokenType["COLON"] = 18] = "COLON";
    TokenType[TokenType["CONS"] = 19] = "CONS";
    TokenType[TokenType["PIPE"] = 20] = "PIPE";
    TokenType[TokenType["NEW_LINE"] = 21] = "NEW_LINE";
    TokenType[TokenType["RANGE"] = 22] = "RANGE";
    TokenType[TokenType["HASH"] = 23] = "HASH";
    TokenType[TokenType["QUES"] = 24] = "QUES";
    TokenType[TokenType["AMPERSAND"] = 25] = "AMPERSAND";
    TokenType[TokenType["EXCL"] = 26] = "EXCL";
    TokenType[TokenType["NEGATE"] = 27] = "NEGATE";
    TokenType[TokenType["ADD_SHORT"] = 28] = "ADD_SHORT";
    //GENERICS
    TokenType[TokenType["GEN_OPEN"] = 29] = "GEN_OPEN";
    TokenType[TokenType["GEN_CLOSE"] = 30] = "GEN_CLOSE";
    //CASE comment
    TokenType[TokenType["CASE_COMM"] = 31] = "CASE_COMM";
    //Literals
    TokenType[TokenType["IDENTIFIER"] = 32] = "IDENTIFIER";
    TokenType[TokenType["STRING"] = 33] = "STRING";
    TokenType[TokenType["NUMBER"] = 34] = "NUMBER";
    TokenType[TokenType["COMMENT"] = 35] = "COMMENT";
    //Keywords
    TokenType[TokenType["ANDALSO"] = 36] = "ANDALSO";
    TokenType[TokenType["ORELSE"] = 37] = "ORELSE";
    TokenType[TokenType["TRUE"] = 38] = "TRUE";
    TokenType[TokenType["FALSE"] = 39] = "FALSE";
    TokenType[TokenType["CASE"] = 40] = "CASE";
    TokenType[TokenType["OF"] = 41] = "OF";
    TokenType[TokenType["FUN"] = 42] = "FUN";
    TokenType[TokenType["VAL"] = 43] = "VAL";
    TokenType[TokenType["EOF"] = 44] = "EOF";
})(TokenType || (TokenType = {}));
