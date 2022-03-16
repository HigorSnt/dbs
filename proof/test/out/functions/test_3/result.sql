DROP FUNCTION get_address;

REVOKE EXECUTE ON get_address
FROM
  PUBLIC;

DROP FUNCTION isPalindrome;

DROP FUNCTION MATH_FUNCTIONS.fsum;

REVOKE EXECUTE ON fsum
FROM
  PUBLIC;

REVOKE DEBUG ON fsum
FROM
  user1;