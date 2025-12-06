from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    wallet_address = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    
    # Health Profile Fields
    blood_type = Column(String, nullable=True)
    allergies = Column(String, nullable=True)
    medications = Column(String, nullable=True)
    chronic_conditions = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    activities = relationship("Activity", back_populates="owner")
    records = relationship("Record", back_populates="owner")
    vault_items = relationship("VaultItem", back_populates="owner")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    text = Column(String)
    time = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="activities")

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(String, unique=True, index=True)
    name = Column(String)
    type = Column(String)
    date = Column(String)
    ipfs_hash = Column(String)
    size = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="records")

class VaultItem(Base):
    __tablename__ = "vault_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    date = Column(String)
    type = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="vault_items")
