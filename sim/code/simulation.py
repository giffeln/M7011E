import random
import datetime

countys = {
    0 : "Blekinge",
    1 : "Bohuslän",
    2 : "Dalarna",
    3 : "Dalsland",
    4 : "Gotland",
    5 : "Gästrikland", 
    6 : "Halland",
    7 : "Hälsingland",
    8 : "Härjedalen",
    9 : "Jämtland",
    10: "Lappland",
    11: "Medelpad",
    12: "Norrbotten",
    13: "Närke",
    14: "Skåne",
    15: "Småland",
    16: "Södermanland",
    17: "Uppland",
    18: "Värmland",
    19: "Västerbotten",
    20: "Västergötland",
    21: "Västmanland",
    22: "Ångermanland",
    23: "Öland",
    24: "Östergötland"
}

class Simulation:
    base = 10.0
    modTime = {
        0 : 0.9,
        4 : 0.8,
        8 : 1,
        12: 1.1,
        16: 1.2,
        20: 1.2
    }
    modDate = {
        1 : 1.2,
        2 : 1.2,
        3 : 1.1,
        4 : 1,
        5 : 1,
        6 : 0.9,
        7 : 0.8,
        8 : 0.9,
        9 : 1,
        10: 1,
        11: 1.1,
        12: 1.1
    }
    def __init__(self):
        super().__init__()

    def get(self, index, hour, month):
        if hour > 4:
            hour = 0
        else:
            hour = hour - (hour%4)
        rand = random.uniform(0.8, 1.2)
        return self.base * self.modTime[hour] * self.modDate[month] * rand
        

def main():
    time = datetime.datetime(2016, 1, 1, 0)
    sim = Simulation()
    for x in range(0, 25):
        energy = sim.get(x, time.hour, time.month)
        print(countys[x], "is using", "%.2f" % energy, "MW")

main()