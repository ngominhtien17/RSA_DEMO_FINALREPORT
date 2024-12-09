import random
from sympy import isprime
from math import gcd

# Generate random prime number
def generate_number(bits):
    while True:
        n = random.getrandbits(bits)
        n |= (1 << bits - 1) | 1 
        if isprime(n):
            return n

# Modulo with Euclid Algorithm
def mod_inverse(e, phi):
    old_r, r = phi, e
    old_t, t = 0, 1

    while r != 0:
        quotient = old_r // r
        old_r, r = r, old_r - quotient * r
        old_t, t = t, old_t - quotient * t

    if old_r > 1: 
        return None
    return old_t % phi

# Generate RSA keys
def rsa_keys(bit_length):
    p = generate_number(bit_length // 2)
    q = generate_number(bit_length // 2)

    while p == q: 
        q = generate_number(bit_length // 2)

    n = p * q
    phi = (p - 1) * (q - 1)

    e = random.randint(2, phi - 1)
    while gcd(e, phi) != 1:  
        e = random.randint(2, phi - 1)

    d = mod_inverse(e, phi)
    if d is None:
        raise Exception("d was not found ")
    
    return p, q, n, phi, e, d

# Encrypt message
def encrypt(public_keys, message):
    e, n = public_keys 
    c = [pow(m, e, n) for m in message] 
    return c
    
# Decrypt
def decrypt(private_keys, ciphertext):
    d, n = private_keys
    return [pow(c, d, n) for c in ciphertext]

# String to int 
def string_to_int(message):
    return [ord(char) for char in message]

# int to String
def int_to_string(int_list):
    return ''.join([chr(num) if 0 <= num <= 255 else f"({num})" for num in int_list])

# sign 
def sign(private_keys, message):
    d, n = private_keys
    return [pow(m, d, n) for m in message]

#verify
def verify(public_keys, signature, message):
    e, n = public_keys
    decrypted_message = [pow(s, e, n) for s in signature]
    return decrypted_message == message  

# Main
if __name__ == "__main__":

    bit_length = 1024
    p, q, n, phi, e, d = rsa_keys(bit_length)

# public keys 
    public_keys = (e, n)
# private keys
    private_keys = (d, n)

# our message
    message = "Harry potter"
    message_int = string_to_int(message)
    
# sign the message
    signature = sign(private_keys, message_int)
    
# verify 
    verification = verify(public_keys, signature, message_int)

# decrypt the signatue
    decrypted_message = int_to_string(decrypt(private_keys, signature))

# encrypt message
    ciphertext = encrypt(public_keys, message_int)
# decrypt 
    decrypted_message_after_encryption = int_to_string(decrypt(private_keys, ciphertext))

    # Print results
    print(f"ori message: {message}\f")
    print(f"encrypt: {ciphertext}\f")
    print(f"decrypted_message: {decrypted_message}\f")
    print(f"Decrypted Message After Encryption: {decrypted_message_after_encryption}\f")
    print(f"Signature Verified: {'Valid' if verification else 'Invalid'}\f")
