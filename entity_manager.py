import re

class EntityManager:
    def __init__(self):
        self.entities = [("1A0","JM75"),
        ("1S","FN30"),
        ("3A","JN33"),
        ("3B[6,7]","LH89"),
        ("3B8","LG89"),
        ("3B9","MH10"),
        ("3C","JJ41"),
        ("3C0","JI28"),
        ("3D2","RH81"),
        ("3D2","RG78"),
        ("3D2","RH87"),
        ("3DA","KG52"),
        ("3V","JM33"),
        ("(3W|XV)","OJ28"),
        ("3X","IJ39"),
        ("3Y","JD15"),
        ("3Y","EC41"),
        ("4[J,K]","LM28"),
        ("4L","LN01"),
        ("4O","JN91"),
        ("4[P-S]","MJ96"),
        ("4U[0-9]ITU","JN36"),
        ("4U[0-9]|4U[0-9]UN","FN30"),
        ("4W6","PI20"),
        ("4[X-Z]","KM72"),
        ("5A","JL45"),
        ("5B|H2|C4","KM64"),
        ("5[H-I]","KH78"),
        ("5[N-O]","JJ16"),
        ("5[R-S]","LG15"),
        ("5T","IK16"),
        ("5U","JK02"),
        ("5V","JJ06"),
        ("5W","AH35"),
        ("5X","KI48"),
        ("5[Y-Z]","KI78"),
        ("6[V-W]","IK12"),
        ("6Y","FK08"),
        ("7O","LK12"),
        ("7P","KF39"),
        ("7Q","KH65"),
        ("7[T-Y]","IL56"),
        ("8P","GK03"),
        ("8Q","MI69"),
        ("8R","FJ94"),
        ("9A","JN64"),
        ("9G","IJ84"),
        ("9H","JM75"),
        ("9[I-J]","KH12"),
        ("9K","LL38"),
        ("9L","IJ37"),
        ("9[M,W][2,4]","OJ02"),
        ("9[M,W][6,8]","OJ41"),
        ("9N","NL08"),
        ("9[Q-T]","JI64"),
        ("9U","KI45"),
        ("9V","OJ11"),
        ("9X","KI47"),
        ("9[Y-Z]","FK90"),
        ("A2","KG03"),
        ("A3","AG28"),
        ("A4","LK66"),
        ("A5","NL46"),
        ("A6","LL52"),
        ("A7","LL54"),
        ("A9","LL55"),
        ("A[P-S]","ML05"),
        ("(B[A-R]|BT|BY)","MM68"),
        ("BS7","OK85"),
        ("BV9P","OL80"),
        ("BV|BX","PL01"),
        ("C2","RI39"),
        ("C3","JN02"),
        ("C5","IK13"),
        ("C6","FL04"),
        ("C[8-9]","KG56"),
        ("(C[A-E]|XQ[1-8])","FD26"),
        ("CE0","DG52"),
        ("CE0","EF96"),
        ("CE0","EG93"),
        ("KC4","FM05"),
        ("CE9","AA00"),
        ("C[M,O]","EL71"),
        ("CN","IL23"),
        ("CP","FG58"),
        ("C[Q-T][3,9]|CQ2","IM12"),
        ("(C[Q-T][0,5,6,7])|CT1|CT2|CT4|CQ4","IM56"),
        ("CU|CQ[1,8]|CT8","HM49"),
        ("C[V-X]","GF05"),
        ("CY0","FN93"),
        ("CY9","FN97"),
        ("D[2-3]","JH52"),
        ("D4","HK74"),
        ("D6","LH17"),
        ("D[A-R]","JN37"),
        ("D[U-Z]|4[F,I]","OJ88"),
        ("E3","KK84"),
        ("E4","KM71"),
        ("E5","AH78"),
        ("E5","AH81"),
        ("E6","AH50"),
        ("E7","JN83"),
        ("(E[A-H][0-5,7]|A[M,N,O][0-5,7])","IM66"),
        ("(E[A-H]6|A[M,N,O]6)","JM08"),
        ("(E[A-H]8|A[M,N,O]8)","IL07"),
        ("(E[A-H]9|A[M,N,O]9)","IM75"),
        ("E[I-J]","IO51"),
        ("EK","LM29"),
        ("EL","IJ46"),
        ("E[P-Q]","LL58"),
        ("ER","KN37"),
        ("ES","KO17"),
        ("ET","KJ67"),
        ("E[U,V,W]","KO11"),
        ("EX","MM49"),
        ("EY","MM37"),
        ("EZ","LM67"),
        ("FG","FK95"),
        ("FJ","FK87"),
        ("FS","FK88"),
        ("FH","LH26"),
        ("FK","RG19"),
        ("FM","FK94"),
        ("FO","Bg28"),
        ("FO","DK50"),
        ("FO","BG89"),
        ("FO","BI91"),
        ("FP","GN16"),
        ("FR/G","LH38"),
        ("FR/J, E","LG07"),
        ("(FR|TO)","LG78"),
        ("FR/T","LH74"),
        ("TX0","LH13"),
        ("FT8W","LE53"),
        ("FT8X","ME40"),
        ("FT8Z","MF81"),
        ("FW","AH16"),
        ("FY","Gj22"),
        ("(F|F[0-9]|F[B,D,E,F,U,V]|T[H,M,Q,V,W,X]|H[W,X,Y])","IN77"),
        ("(G[0-9,A,B,F,X]|M|2E)","IO70"),
        ("(2D|G[D,T]|M[D,T])","IO74"),
        ("G[I,N]","IO54"),
        ("G[J,H]","IN89"),
        ("(G[M,S]|2M)","IO65"),
        ("G[U,P]","IN89"),
        ("G[W,C]|2W","IO71"),
        ("H4[1-9]","QH98"),
        ("H40","RH29"),
        ("HB[1-9]","JN35"),
        ("HB0","JN47"),
        ("H[C,D][0-7,9]","EI95"),
        ("H[C,D]8","EI48"),
        ("HH","FK28"),
        ("HI","FK47"),
        ("H[J,K][1-9]","FI29"),
        ("HK0","EJ93"),
        ("HK0","EK92"),
        ("(6K|D[7-9]|HL|D[S,T])","PM34"),
        ("(H[O-P]|H3)","EJ88"),
        ("H[Q-R]","EK54"),
        ("(HS|E2)","NJ96"),
        ("HV","JN61"),
        ("(HZ|7Z)","KL76"),
        ("H[A,G]","JN76"),
        ("I[S,M]","JM48"),
        ("I","JN51"),
        ("J2","LK00"),
        ("J3","FK91"),
        ("J5","IK11"),
        ("J6","FK93"),
        ("J7","FK95"),
        ("J8","FK92"),            
        ("JD1","QL64"),
        ("JD1","QL04"),
        ("J[T-V]","MN48"),
        ("JW","JQ58"),
        ("JX","IQ50"),
        ("JY","KL79"),
        ("(J[A-S]|7[J-N]|8[J-N])","PM85"),
        ("KG4","FK29"),
        ("KH0","QK24"),
        ("KH1","AJ10"),
        ("KH2","QK23"),
        ("KH3","AK56"),
        ("KH4","AL18"),
        ("KH5","AJ85"),
        ("KH6","BL01"),
        ("KH7","AL08"),
        ("KH8","AH45"),
        ("KH8SI","AH48"),
        ("KH9","RK39"),
        ("[A,K]L7","AO01"),
        ("KP1","FK28"),
        ("KP2","FK77"),
        ("(KP[3-4]|NP[3-4]|WP[3-4])","FK67"),
        ("KP5","FK68"),
        ("L[A-N]","JO28"),
        ("L[O-W]","FD38"),
        ("LX","JN29"),
        ("LY","KO05"),
        ("LZ","KN11"),
        ("O[A-C]","EI93"),
        ("OD","KM73"),
        ("OE","JN46"),
        ("(O[F,G,I]|OH[1-9])","KP00"),
        ("OH0","KP00"),
        ("OJ0","JP90"),
        ("O[K-L]","JN68"),
        ("OM","JN87"),
        ("O[N-T]","JN29"),
        ("OX","FQ37"),
        ("OY","IP61"),
        ("(OZ|OV|OU|5[P,Q])","JO44"),
        ("P2","QH49"),
        ("P4","FK42"),
        ("P5","PM27"),
        ("P[A-I]","JO11"),
        ("PJ2","FK52"),
        ("PJ4","FK52"),
        ("PJ[5,6]","FK87"),
        ("PJ7","FK88"),
        ("P[P-Y][1-9]","FH49"),
        ("P[P-Y]0","HI36"),
        ("P[P-Y]0","HJ50"),
        ("P[P-Y]0","HG49"),
        ("ZW","JO11"),
        ("PZ","GJ04"),
        ("R1FJ","LQ59"),
        ("S0","IL10"),
        ("S2","NL41"),
        ("(S5|YU3)","JN65"),
        ("S7","LI30"),
        ("S9","JI39"),
        ("S[A-M]|8S","JO57"),
        ("ST","KJ18"),
        ("SU","KL22"),
        ("(S[N-R]|3Z|HF[1-9])","JN99"),
        ("SV/A","KN20"),
        ("(S[V-Y]5|J49)","KM26"),
        ("(S[V-Y]9|J45)","KM15"),
        ("S[V-Z]","KM06"),
        ("T2","RH87"),
        ("T30","RI78"),
        ("T31","AI25"),
        ("T32","AJ94"),
        ("T33","RI49"),
        ("T5","LI08"),
        ("T7","JN63"),
        ("T8","PJ54"),
        ("(YM|T[A-C])","KM36"),
        ("TF","HP74"),
        ("T[G,D]","EK43"),
        ("T[I,E]","EJ79"),
        ("TI9","EJ65"),
        ("TJ","JJ41"),
        ("TK","JN41"),
        ("TL","JJ73"),
        ("TN","JI55"),
        ("TR","JI48"),
        ("TT","JJ77"),
        ("TU","IJ56"),
        ("TY","JJ06"),
        ("TZ","IK42"),
        ("(U[A-I][1,3-7]|U[1,3-7]|R[A-Z][1,3-7]|R[1,3-7]|U[A-I]2[^F,^K]|U2[^F,^K]|R[A-Z]2[^F,^K]|R2[^F,^K])","KN84"),
        ("(U[A-I]2[F,K]|U2[F,K]|R[A-Z]2[F,K]|R2[F,K])","JO94"),
        ("(U[A-I][8,9,0]|U[8,9,0]|R[A-Z][8,9,0]|R[8,9,0])","LO49"),
        ("U[J-M]","LN81"),
        ("U[N-Q]","LN37"),
        ("(U[R-Z]|E[M-O])","KO10"),
        ("V2","FK97"),
        ("V3","EK55"),
        ("V4","FK87"),
        ("V5","JG68"),
        ("V6","PJ88"),
        ("V7","RJ28"),
        ("V8","OJ74"),
        ("VK0","MD66"),
        ("VK0","QD95"),
        ("VK9C","NH87"),
        ("VK9L","QF98"),
        ("VK9M","QH72"),
        ("VK9N","RG30"),
        ("VK9W","QG68"),
        ("VK9X","OH29"),
        ("VP2E","FK88"),
        ("VP2M","FK86"),
        ("VP2V","FK78"),
        ("VP5","FL31"),
        ("VP6","CG44"),
        ("VP6","CG75"),
        ("VP8","FD97"),
        ("(VP8|LU)","HD05"),
        ("(VP8|LU)","GC69"),
        ("(VP8|LU)","HD60"),
        ("(VP8|LU|CE9|HF0|4K1)","FC86"),
        ("VP9","FM72"),
        ("VQ9","MI53"),
        ("(VS6|VR2)","OL72"),
        ("VU|AT","MJ88"),
        ("VU","NJ66"),
        ("VU","MK52"),
        ("(V[A-G,O,X-Y]|X[J-O])","FN63"),
        ("(VK|AX)","QF44"),
        ("X[A-I][0-3,5-9]","DK78"),
        ("X[A-I]4","DK28"),
        ("XT","IJ79"),
        ("XU","OK10"),
        ("XW","OK07"),
        ("XX9","OL61"),
        ("X[Y-Z]","NK69"),
        ("YA","ML09"),
        ("Y[B-H]|7C","NI89"),
        ("YI","KM92"),
        ("YJ","RH33"),
        ("YK","KM75"),
        ("YL","KO06"),
        ("YN","EK61"),
        ("Y[O-R]","KN04"),
        ("(YS|HU)","EK43"),
        ("Y[T-U,Z]","JN93"),
        ("YV0","FK85"),
        ("Y[V-Y]","FJ37"),            
        ("Z2","KG39"),
        ("Z3","KN00"),
        ("Z6","KN01"),
        ("Z8","KJ27"),
        ("ZA","JM99"),
        ("ZB2","IM76"),
        ("ZC4","KM64"),
        ("ZD7","IM73"),
        ("ZD8","II22"),
        ("ZD9","IE59"),
        ("ZF","EK99"),
        ("ZK3","AI31"),
        ("ZL7","AE15"),
        ("ZL8","AF08"),
        ("ZL9","AB80"),
        ("ZP","FG87"),
        ("Z[R-U]","JF86"),
        ("Z[L-M]","RF64"),
        ("ZS8","KE83"),
        ("(K|W|N|A[A-K])","DM57")]

    def resolve_grid(self, callsign:str):
        callsign=callsign.upper()
        for regex, locator in self.entities:
            if re.match(regex+".*", callsign):
                return locator
        return None

if __name__ == "__main__":
    spotter = "KC4GL"
    dx = "AA1SQ"

    em = EntityManager()
    spotter_locator = em.resolve_grid(spotter)
    dx_locator = em.resolve_grid(dx)

    if spotter_locator:
        print(f"Locator for callsign {spotter}: {spotter_locator}")
    else:
        print(f"No match found for callsign {spotter}")

    if dx_locator:
        print(f"Locator for callsign {dx}: {dx_locator}")
    else:
        print(f"No match found for callsign {dx}")
