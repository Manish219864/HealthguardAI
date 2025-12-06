import sqlite3

def migrate():
    conn = sqlite3.connect('healthguard.db')
    cursor = conn.cursor()
    
    columns = [
        ("blood_type", "VARCHAR"),
        ("allergies", "VARCHAR"),
        ("medications", "VARCHAR"),
        ("chronic_conditions", "VARCHAR")
    ]
    
    for col, dtype in columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {dtype}")
            print(f"Added column {col}")
        except Exception as e:
            print(f"Column {col} might already exist or error: {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
