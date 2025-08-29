def calculate_change(current, previous):
    if current and previous:
        return round(current - previous, 2)
    return None

def calculate_change_percent(current, previous):
    if current and previous and previous != 0:
        return round(((current - previous) / previous) * 100, 2)
    return None