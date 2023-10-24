from ..models import db


class Cell(db.Model):
    """Table of cells"""

    __tablename__ = "cell"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text(), nullable=False, unique=True)
    location = db.Column(db.Text())
    latitude = db.Column(db.Float())
    longitude = db.Column(db.Float())

    def __repr__(self):
        return repr(self.name)

    @classmethod
    def get_all(cell):
        cell.query.all()

    def save(self):
        db.session.add(self)
        db.session.commit()
