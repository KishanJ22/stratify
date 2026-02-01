def kebab_to_camel_case(text: str):
    parts = text.split('-')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])