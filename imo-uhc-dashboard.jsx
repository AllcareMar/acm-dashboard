import { useState, useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ComposedChart, Line } from "recharts";

const UHC_BLUE="#002677", UHC_GOLD="#f5a800", ENROLL="#0ea5e9", ELIGIBLE="#10b981";
const LOGO="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAAA8CAYAAAAUlTqlAAAosUlEQVR42u19eZhcRb32+9Y5p7une2Z6lsxMZkkGJkMSwioJJCRgiLhv1y1R9Kqfy0VcAHcBlQQVvO6ouIALV1FRolx3RfGGqGTBRGQLkEwCgZlMFshs3T29nKr3+6O7k04yycwg916vz9Tz9DM9fc6p+lXVW7+96gBTZar8Hyv8n25Qh7VJQFPTMFX+IUBbAmf5AwJ2nHtN+V8Cbmpqpsr/GGhVBB8PB6kAD/Vd1elcGE+40AcpmDCPWDjKJ58cGaMebwrAU+W/FbQCvEqgqrp1WoGcbRw6PJlaa1zgABhHCxSRaFTRPpWXMYO+c4/uztitrdiTruTYU+CdKk8baAWYMqAeQ0dVa8ItJsyJAAhhFMb5cGgS2SphGogkpACAQGQpDhpor4XpN8CTMPKcEDdiysHeHcn0by6DdxXAq6bAOwXav1dnJeDU1FSdz/gvocxxkAaMYVTCmQTmC6gXkSawW8BeBw0bIAvAQIiJaDDgdEHNBH0AfSA2yOI+a1yEMgmP2hSkd90+FkefKlOgnTR3LVS1vcRB80E+4hlzHKUVEpsB3S1ivRMf9YicJ/kWDADQQQYCDQCQIeBCkNY5JEjNJXkugFkk75bcTwqOIalmAr+MZnbdrYPG3ZTnYQq0E9ddFe+cnkPhrYT2ePRigN5NIOaAHzjgHgpxQ1R54jCg3Xlot3Vuf1VgUgiyBaiOyKej8CI1hbxtDny2WbDFSREjDQAwBM8X+S+ENofgNyjXCiEdjO66noCrXDxTZQq0xwRsPta2mB5faJ3bFBjvLQCWAfp8weFeQ3QbMu0cNgaj3r3Ezuyk2qhpawytFgjmGSAyzqE3IF4JcjmgL4ZwdxuYeb7865jZuXtKXZgC7biAzVa1vsyQJxlqB+B9heBdTuEXLHCaIUYDi58x2//YYa6r0leoUqRXBBrK/txDXFyq6jizQPd8QbuNsJfG+xLAPaELr/YMF/l0NzG1e8sUcKdAe0RZA/jLgDCXaFshoMMHraG5NnTuMie7zTPeMxz4o2i69/4KoD5lH2vJ14sDenO8/UWOWGRpb4/IvxjAs0Knt9LoTIA3R9N9906pClOgPYLDFqraXirDWU6oihpzdV721Q5q8QBF0v3XVYDVPV0GUmWgQomW5hD+xdbprsCYxSDeX7B6DY0WuNB8qyrX2zMF3CnQHvAS5Ks6zgT1HBCZgOYLORu+zJAnU3ogGO3/aQlcmhhYb/GwtKnY7to7HHCVm+jCAYBsvP1DPrUTNLMJfLRg7atouCjiB5/C0M7hidMxVf7pQFv2w45UT2+MyrsUcA9G6H8vL3sBxS5L95eqdP/vBfgEwkm095QAVekXzifa3yNolyHPoXhB6NybDXFKJLPr6v9b+q1K48+pRTaJYo51jYCLOO+txrm/eDDfyDn7UQKNlHlg8oCVAaBk159eUTf7vhvqT7j7q42zN80tMUYzAbSr5ObyI+m+L1DsCh1/BegBn+Y9BujNVrW/ioCtMP4mCaDKz7HumUgdxyhL1/jFe6jiZ6UBdAyaV5qJ0VX+3OKNXd/h902A1gn1b9z6+PT14SictqwWFBJtz3YyxxF6DQEf0ufloSOS2vXVSQKWANDRsT6WigWPAvRpIg2yqVsHty9+JZbf4mH1CjsJrusBUD7RdrWl+21E3m1O+rgDYOXdGB99vL8M9H9kjtE6vy+OXf3o71+QOThOTyfXfbrr+9+SRof2gUc3gFpjhTjfA5phA31R0HMdeF403feRSaoERc6ydlmY7Fr/JuMnvu0PPFSTr5vxXMPqnyDMdQ7sWPB4iTg3QdCSgDKxthnG4M2EdhmarzvoAsK0RNK9X564miAD0DWcsP5EB//bYNQ4O3rl8PaFtxUX03IBdHXHrz8VQdX1cNlsiMiKVM8Z+w4MaGnR1Xavu8gL2t/o8v0bh7Yvene57gpuQ2CV6rs3fQDwXiIVEoBIRlJOhe8ObV/4jYOTVPzbcurfEtn06I+M39Ds7JM3D/Us/kKJLgdQ9V2/T8rU/Bg0nhSOAp4MI86p8J9DPWfdWKYhOfNP9Yz4PwZ8CIVciSRnGKmGzV08sGPxfYfRe8j41JywfqFR5HPGRJxs+pbB7Yuuw/xNATYvKFTPvnOu54LrjammNLJ6cNvCL1fSmDzl3npm0rfQr0u6cOibQ9sX3VC8/oCAq1yi685mn2Y16YVCmC32IXCAvXlg25k3Hw5ccxSjx+WqzQsMzaOCu9wCV1vgNBl9t3Tb5Cz0tXc4ACDNh51L/WzfvhWpoW2LfiaXHXDMfgiAsPQOM9HqCEiAF8/uetwnHpQxAw7aJPEVgJitaZtdUiXGF32ldp3FKyEdD5drMtSbAQB7mwisZnFc1CyXOwPAaR7DmuLDq3jwPoAycxU+uYjEaWMYoAa4ytV1b/i0GKx0yNeBph30pkuFBBlcV9u98aLiIpAHrDYAkE2lF5E8X3ZIhHkHABTBUGzbt7VVAM6gFADBSYQ53bnCTNL/SnLWhgvLIDRBtFrCKZL1gWAeZE6DzGk0yaVUML1I4+oxxqv4mwHaobBTLhcCeHNR3BeL77xXA2qQ0o2QTqkYk+I96dR5IhbLpj1A5T4cAKHvBdUAThcUgMEpoDnNKZwpmG/Xn7DhgoNjcnSd1gmdMePU5eS6KETldJdxyMZGdm0tg3oS7N0DrlKya8Oz6NfN8hi9PDlr/XmJ4zdMk8KryfhbG7o31GLtMjsZ/aqsu3rpXT8xTicCupbEcgmDRji/ZPCNvxDW7lNJgz8HsrukQi+AM4CidACWl20lQXYvpH1Hp0k5uOwTklJHirgVtqF7Q63AFXCZrRTjoj4D4isCYlJ2g5G7EBCxGg7zu4q0G3O+hCeh8HFBrcnZG44vcp2TiotJWUJuj2Q7AN4PuF+CrkEu1wPg9YdR2A+ok+IfCHyScp+VG3lbjvl7iteXH3VeKZMnXE7KVwGorZ/1whOxeUEBWOMLWAjJQWEEcCMVDIGlsT2f4l4h3wviuHjnxunFxXQSK+ZzN6EZFDdT+g2kRinfI4c3FUG+emxDrKTLKkyEiwQ8AeD1JG4wBifk6d9a4lyT9YMKgECtcuHAvfu3zX8QwNd9D5cMRWu+THoRS/e2EredtAFFwFrormJftInEMogRVU9vKgF7HMNphU12rqmDcIKABGmaATXWnVB1EgBg/uaDY0T6APxjkkP6KOUCHSxFrlhwaiGQE83xovvE0LazPju47cxPwOjbxp/2TBHT0L0tAlDYPN+WSFxMIAuaUwjm4fCsIl1dpXyjmAAagREh+6XBnoUXQbqRQCsoUzT6DiDPA+CZMPzG4PZF1w3uOPuLA9uecUN6x5K943ox5AwIEaYZEB31HECs7YqfDmgmgVoIHuQd7Pva8ywgUjwTREhwLkEFAc6t7EOZ4QrwrLKfHuw560JSt1BsKdF8yIIyYxlmok50VELgdEtuApGtzjzWX/IoTEKxlwGo6tmb5hq/4VwRH6g57q45xm+cQ/DN2HJyXi59IxF8oKj3nmcxidByGZSxTP0aia0Eb4bwAkmDOWcWju8hKYpg+fGFgJIo6ukGgpNK4Bjaa/AUVtLRh0SGUmho92DpGh/z7o84jzeKOE/WvRI93y+U9ftpcze1AugWlJKUgDAE6VmHVpetaC2Y1tm5JkZhP0g3JiVkYH3v+clZG5bVdW9Zmui6s3miXgSJBVGNRYjgXIDyjHs2gaigJoB5levZ12QAqnbW+lkgOiVkBMYkpViUhMBobIw2I03oXBODtP9o02eOAEFtRwMEQ3ExgI10qpXTBj0VH+vy4jOezX1EduSJ4Z5Fv/O8wjVy6f2g11LX/efXGYOP0iSbanvjrwAoLF0zWW5riC150vSL6Cuxi2ZjMKOC0x9Fny3ponRLRfogNkH6VYnnnFMcw5n/Lda3ZDysXRZiyxY78tDCJwcfmr12+JElfykFWwwAFMJwCaAaErsBfBOQQJyKefdHsHn+GIawnti5c1lWxrRAOnK+BN9IfwHNqwldB9pf++RLi+M+vpQj4QMcAjgioLu6+49NEheUpO8QCMMyt07vK0kCnishDugxyH0XhEA3H5DBlpPG6sM+7FyWFVHSsx2PCtpyvL+Qd3MljBrgTEJrSdZGMvX3l0A9CdVgpcFquuruvzYZU30BlP1Ycuaf6ulPewVs6r1yhR9B0X/fv21xnwuf+DOBlZVG2ySKA4AIw7vhVCNqM8AFAKjkzPpj0lw2EIGFEDw6bBN5J0CCOrlp3v3V2HJS4b/dqzN/U9A458GalpbbEofogtBSEB6AYYC/AEgKrclc6pRDRDlBEJYwl9bN2vgtAm8U1A+ARb38kMFKEjACCgCGDJGZmPSQBEQB9Ip4iFTMU/BOADME7iO4XkIClAOAzgOP8dwSmJ8w8H4NgQBnVM9eN3sMTwU8eh+s677rRsC8QtSeg+roajMWpy1aiR5mUIgIrBP4mBFTxJb8hIyaQ7jYeQaAPGUvFqTBjsLX6PMKuVxhcEb4fWd4rQkaOxq6Nyxyhu/3gmnz6rvWLQFWqehYnrgnAQCQauhxVBzgZgOcLKdcoVDoqlyQR+qzV7n6WXfNkDCLwEZ5/gsB72IAf5VYnc+mzhpLz3PW94qi/ST/EJ2xkqyla3zMe6B0ve2I/tAwxNI1PpY2MTkYvsjKPJStTv6hs3NNrAg0GQKLIPwVYBdpPi3o8RJHO/8g94sJQkDxLjKYA/J0SFtoqjog3HgYVSHI2YD9Ijy+XAyWROLxnwE6AtxHtQGkEMJmiRbgv4FogHAfoMcIRcvcfefOfQXMuz8iYgGkTSBOFnk1wO0CsoHzlx0KV3oUNoLmNIAnEe5hw2gHyW8VpfbyMdUDAYAVax3RQmgIZCig7yk5hNeeZ9G5JmZM7BK59A1Ye4eDX/Mu2JHvYO2ycGTb2RtdYe9DFu7zI9vO3mjDJ3eKWvVUnOFFj8aWvJHJUXgcVANgDMHWo2qZZXHI8FwAHog6CnMId4qAdoI5GCwbQ0Y6k/CfKIr2FXmsXRaieZ8O9SErV7x+cvE63lYoPhoRCCsgcFbtWLssLIFloexwNaC6VCwIAKDhhA1zJEwH6QHBcYA9A8DxItKQzj1EpyWtoJMI9AOhRM0WcuuGtp/9jSMWlRAiLNw/tHXRI0Nb5z6y597T0xMfczoCVQZmHQmfRB+EJMj/AmGL7vNyWWFrs+lTITSAiADB8YB9BojjIKUdtPRgH/Ik5ACeRJrHgYKRMEfK/3Zg26Kbiz5dHvC5+xUcy20CAkoeDdop9Eku8Gn6Ju2bXXqHh7XLwmSw/gKY6mRozapk9/PeZExNDF56VbJr3QfomQ2Q/YDnt/6ivmvTTOvyV5hg2vdrZ63rHt6+ePvYju5xzb4BCDEAjkS1A+vG1y24CBAE5CX3OgAy1EWQFkI87fAJF1yMo/mL67s37i3uGLLDgzuCW4GymFVWYHd998a3Aw5gjXM23TO0Y+EfPGmfgIDAdtH/aLJ7Qw3pV0n2dVThYdB4Tz68JF1iHosBBwiNMvZCyaYM/edBeI3glOxcUze0c9kg4gmgkM+TaAgLI//PeMESgO8j3PSauRsbR9aetb+Cl1hAIfzoa5OzNs4R4RF+ziL9y1TPM/eNF0GjXF5ANIjG7y3kUgNC2EN4MxRxf0CeSwmXPyQIYNwSSQJYC+BNDsxReBnBf4HU1dGxrqq3d/Fo6faCgFrakeVCZDng3iK4zsY5f655cvWSVCVth4jN+cmZ1aV4eJMD9gImyDjsnzSjLXoBQJmPKHziv9I7Tt9LBB+zhd0b929b3EdjLpNzHxrsWfJL2cEhx9w1wzsW/0AukzHA5QBUMuImVMoePE/YD1AUU3RIelLkmDTO3xQAOI+MtAj4+fD2hb8d3r7wNjp8A2AziYV1x93ZWZxv3we8JMBewV0kuCsBXAUGN1XtydeXprUGDAolDfAqAR8W3Jdg3McBYGDHgiGQt4LRbsANEd5lgt5OsB+m6oyiOGdJz9bzDGMtJO4d2nbWrcM95/zO9/3PAoqSkROMF1sMAC4MPYD1QpD0fL/ZI79ZFJrRE71Q7zpU99V0kn2CXkLoagOs8rzktyM2dtrheuNYLi/RbwZM474tJ6cErDd+08tE7hjesng/oGkwsfqS3lsW+c8lYy0U7xrsmf+L4Z5FvxOCzwuqFv0TUzGcVazaMwAaQdbLRBpD574GMkJETwut/9bDDUVTkUGFTF5VICShhuQQIROPRVKTi+PLA4hk18bzTdDUJeADdd3rlpqgrQ3Sh+u71i2hV99ARp6f6Ppbs7OZa4xf/7qWU/+WkMt8lqb6DTVzNzZiNV1l1OXYTooibXIcgWRApBxRY0FvbA9CcdU2prJNFDNgcL8hf1PUpW/xwojZKHAdTVW/9dRW7L/dZ4zfAzBH2AcBbAF4L1S4PQBGi7W6hw3juynuBnUfpC0kNxC4s0iovMGe33wQtJ8mo1nIPUnnRsCAcIVLB7cvuu5AApFAeLUPOOEnwC0e5t0feeKh+btF/Nr4DQ87oBkAwqzLgHzYmKqHaDiwv2fRMImvGy+5TdKcsn1gc2Ea4DbBIxE+DOp+wD3g3PAGB6/kp10+xhwXf7PG2228xCPFfgNG+jFNfLvgbgJAOG433rQHSfQU80zWVUFw9KofAHkrcIuH+ZuC4e1nPELgd8ar7xG8ZgCIRoKUiK3GxB6Ws6n0I2fvodyNxqvbSunkSkZ40C97IJY/vdMz3nMBvAHAvRTuDUbdTUR/ZlJCGnTJWev+RHitg9sXdtfNWr8RjHQN9sxvSs668zaaqjMB1simvjZkww/WR5syzg59LBJNfjYMzYjc4MrBnsUfK+csjOunAMxVgFOi/dS8cDqIi4ywWcB9kUzfDeX+/aOlgiRPubceQ8DQY6cOPH0JLv8wSTJPOQ11vD6YcSJZkyy3eADV0L1hnuc3nSPay5Mn3NVlgrazhNHP1Mzd2OgFLc+Vy3wIbvQm4zdchGk1VnbwP2iq379vy8kp5wZuAaLvRvfWaDmiMl6rq0p/8xUn1rhJbdo8wrle/p8TCBtwghNYybw8ABi679SBImDFkoTSOHThGHRV5OYeK0XwKdE/RjtHpCIeTpf+/j6MTdshoK1iUGBxwvKiYiCE+qpg4sGE5QAgK3uFsyOpoZ7Fq+Hyn5BLKRav/ooJw/fKZe1QWLgJHq+lSQR1A7m3G5P4qPFqE3Xdf/5XMLjc+PX1de6J10zU6X1QZWOkNCJRADmVBm7VuBNTzms9JJFMYyxcPcXFrcNyUOyhE0oBtBOgC8egS8d+7u+if4x2ym0caEdj1/X39GFs2kylvjoU4SgEghw2QlJwLpPNV1fqveMFExJdf2s2Xs0FcKOfbujeUGv8xgtkB366Z2jAklVXyA79FDv3FQa3LnrAFXZthomt3L/tGX220P9nIXrN0LazdrhwzyYY7yNF5/jEgw00qgHpICRApADZiYC2sm/lmTj8+1jXx7t/rOcPvcZD4v3jtX2sNjSOH/1YfZloOxOpayLtjtf2eHg7pKPJocdGAJHQXoEtAAu+UeNkggk+MxcDnknats84Zy8BYgUH80HsXJb1TPPcwe1LXgWssACtk7vI+HX19SdseJFM8D4vaJ1R37VuiYQPGH96d3L2xmcBV+nYWf0VIo6oB0RQ1QQGQeYnFaA4qBfo8O+VCUUTvb/8/1iTwzH2sh2rroP+6LHbGC9aeaz2xqJxrHaOdm2scQGAWyroVTEKx6O0bQ4H87FsEHNYw6FIC6GPVBuoghPbxtd/i8GEjo51VcbELnZ28AepWF8AL/ZxaCQwwKfqutffYsOdlyW7N9xcN2vDj+tmrV9t6F8mFegcrh/etmCTK/Q/6ojPDW0/+w4X7uuHDVcdXeyM4XN1aIBQBcCDkDZOQ+PLu87YSKKl+cD/9V1JAQEADNW0NT6GjqpKX7bindOF1nj5t360JFTflQQAtbQk9jU21pQBNlzdOq0USh4DgN1R1XY0HE7L/vr6Yl1oSSg5s/6I3JBkZ91Iorml/Ntw9fQmxTunq6qjfSu6o8fq5+AR7XVHFZ/Zqpq2xkrwlvuuUt8FUDVtjSr59Ydq2hrV1FRdoYi6kURLc3kcys+sKCXhq7p1Gku7tA9IkoaG2mKd8yLlBVcGKwEpPrNVmBcZj9MSADxq2Ar7JCYh4wdwbRMKJoAaieG19JJJ5/yroFg7Eb1JNnOjaHyBUcGbBiEhIhAZEeXLDv4HTGRNsvNvtULhE17QtjA5e8PxUnalF7ScUz9r40nFxXf00G4x22tehHRREDMg7hecFbXraHpbeQLC6vDFEXlb1dBdCwCFXPaP+XjbZwEgZrFxekJvK94/L5JNtH0Hxj5aSPDr5Xoaq/yv5HO5XwFAIeV9NZmJ/QAAMlUdZySc6bGh3RMm2v9YmnQK8wMAyMUzHwpDt00oTj4AFBLhhTX5+IMAUIj77yoUwrVlhiLAK8TbPu9Cuyeq4I8CuBXd0Zjz/gSGj8Og97jq7KLygjm8n/lE4cpEqIceQ0dVGTiFRPrfQG2zjr1hov23pUXEUt9X5+LumwKYq25/ZWjZg+rWOgCIO/wqn4l8ujyw+XjblXFEHs3ns7cJ8MqcdzQ+/flhomNrKHNvmGj/qZKddeX689noT+DYaxPDfdmqtpeWp3IwObM+H2+/3Rk9UogPfqCyD0cN4zqrXkPlCQ0SmhmSNSXEu2MHE0TKXOEKezaNPLJwqy1kIlbZqxz9q1HQpQyDS2jtu2jtxQztJcWPu1Q0H5eqVzmmW2Lx+A+dHcjAhtcMbf/9t5xL5xwKHy4FG46tj1anuiVmCM0X8AANoxnfe2S8RB8nFwnIJMJseWCqDPmm4iJgQIc6AMhVD72UwHJIZwV0n7ylDAy6BkFF7iokRdUBQOCFVY5IWuEtAM8IHS8pctshU0pNO9s3fkOhKnpiBTmeb/zWfHXHM0GXEdFUpj+faLsa5DsN9bqC+K8AcAIiEjUzBD4FmpOCSObuMaKXrjRQZ/vGNM1I6ISDKohpLsCNFKAXCzg7H+rrB8eKdxN8HgEZ4cWOGGSq/4lSP2soNABAtrp1rshVBvYlEC46EJmNz2z16f0KxPdCj88UcHIhDG88UD/NLCfcKOG3JL9R2sLl4oXwYkDHh84ttLbww1J9dkzQlisLIt6DJGMO3ATwmb40lI8PnHyMxBMPIGq7NzzbBNO7JO+ymuM3zmZQf49noj2eqeoxseQjjFY9ymjDYZ/GR42p3u55rsfzo/cWAwTpLxl/2msa5zwnATdynfHqXj1t5qZWrF5xtGCDKbq77BnGcFjiAkJ/AaC64d794xkoHjyGgEBTDFCQgz69mlzVwIsE7XamtMotrQcT2281wNTuB5ej2y/eb6wHDpdGMQ+wuP8qpHVQLprpu8lBWwV0FO/pKRS5HeeVxu+MirHMl1bSO+EYEkWdvBj65Tud8C6m+n6cGO39CwE9irQhUICDLdh8HPs9V6l/qnwUK5qqScwpjtPB9mwxZyGsSu/6g5wuI/EqldQbA/4uIBtV35WEdAaE31QMm3VQoZSLoQjIrORHM7v+BnQGBJSHfbGEJ/1U78eqhnt7IPcOQS8qqxUAvIL4+5D2u4ZoBrq9Ulg9JEzyvkzflqrcvu0aI4fbHKE4D/fuB+EM3Z0CFslwhIYLSw/yaG4QSle6cN+eoR0L/2BMuBKQrEs913H4eOUGjlNu4DiHweOdhrqce2KWcyOzrH2iO8yl5soNPhM0LptOfcgo9u+AQRjigy5irgEjphBkLwGgkrF3JLPEvIikVqkIDAF7ncPjE/NDijzUQPBDuZ00/DcJcTgXAkB0tPdnAr6X9MyOdFX7IqInd5CVKVTZtqDCEiexBjC2uv2HhJoC8NoyiBri9kRI1QWF20EsrRjJeGjtk4DmgVx2YNtOfOY0QT6Au1TM8A8AII6ML2HUN7zSGO8viEdmVTKX1eV006rIyRCiodwOkksrjICyv80jzSMBCKQj9QAwauzmEC6Xz2VfLrBN4u8rFDLPsMjkYiO7Hs5JV8RM8NtcouN15QMHDTFD1I6SamN8jzsJ5rPDZlop03EwoC4NYL7ogI8TPTkB/pMZdy2Jracn2h/JxFpn4jBD7QjQlsOhFB+UmCK0G9J8J1Sl4p3TccRmwWIwob7rrpM9v/kcIndVR8e6KuMllzub+tVwz9m/ZwEvhR97JzzzDoZ4B63eTudfROcuNKh+G317/uC2RX+Cy36NJvG+gR0LhlTY+1OamkuHtyze78J9v6BJvKPl1L8lDg82lK3pbHxgGak+QReQ+BXJZNS4jRNL9GGxQrnyBsY65+x3CDb7xpsnY0rG3FITpHvfIODmCPHLA0aUim61MmIP7ACW8wA4A/NqJ/yE6d77gM5oMffXW0Kg14FfFrG4Ykzjjq5HxC8CY14BIg0ACJAF4FljkyVRSQBohu9I1FnYSzzfr0em78FKqbn8gFdF54rYYaWvQTrnYMIaPZSOnbKyMUAcDpgGgNpU/xMSNxnyclCFqCnceQijUlE9EuZFYpm+TxacvdwDvpdLtJ9aHBamJCTKtOQdoxJQCEyqZLpnYHiuFZoi6b6VArgaUDv6M1668ByAj/me+c+xHACH71xwAuin/Q0Emhxwk8QLPWFrRIWX8/DNgstL08PC5XKZsLbQfmMqZj5hghmBR3N1Q/eGeSbS8kWo8CaRrxdR8dEbgMLrDbxLq7v/2FRw5lNkNF7Xve51nh+73It01iRnbXi/UfTDxm+qHU1l/3WsYMMawCd4VkkazpewBlSeqd37yqAeC6p3HBCRygMKR1zolfKpfdB7DMD3PBodTJLu8wAgSPe+wScbc6EWlcYsdzAFUnMEFkq8KOKAfXm5qw35FjU01AI7S+LenRQYc7IRPkqgKR2fWcrSR0ggFrHu+pIxVdxZMfTYAIXHfHnvLlnXJVeeI0ALmeyjQ8jiaFvmyXk+zRkGuAJg83B167SKhT8KAD69SwvCQ8mRXU+WjUVCt/n0Z0N8gOk9ew8YRET24D64LQKASKbv3520T9LLiilb+mOU5uRsdetcAg7Smwj115b0Ygo1odxnCCBb3fZ2AlpeMrqIPemwoDcG5Bmjsba28lnExwrjGmJn1hnuIPmIqIIjF8Ignq1pP6G0L8sUgwkrbLxz43Rjal7t3PBnd+48PgtgKMxtuWZ/z6INVrrChvt2Dm5f1DTUs6htqOfs1opP22DPma2DPWfNSUUahtKPnL3HucGfC8Enn9y64KEwt+VDBLIDOxbc5/K9G2l4OSBTTpwon2uwONH2Sho+ZMB3S/gxifogzz9MOJ1SDDz6vnERv1Rvg+Dag0j0RkgenJoAIB/PvNYmOv4cxtv+K5T2W+FeAXTS6sCYOYVEW19gvFMh3FqGSoSmI3T8miA/l6u69sBB0OIrnPRzUCsDMh7QPaukqNQCPIHZ3TsLshshHl/WTS1xkQFeYOPtD+QSbbfqQLKTPI+84biEHS1Utx7wHpS4txVgJL0c0I9Bc2VgTG0EpqQiKIjQn1VItD8KYgGc3lL8fZSl0bsdJECVpFZ3iWEoCWAaABRibWfaRPtfw0T7f5JsNA6/F8DEaN+GgvSjQN7mQqJ9s0dziRPee8DlRc6gM4+L+GpE5isl16ANE+1XqrrjtiDg6tDpwapsfO/hW73M2O4jmGjK/YbCTELXeMBHCNxDhzceeK6kXwa+fSdNzKMJ+pOz7nyZHO8k9Ltk97rlNP5rCfeFonRdc/RdrFtOCgFRxNXGxGfUdq+/zBiuc9TDdbM2/Auguz1/Wmdd9/oXAdSF868PCFhVtXdQmAOHOoALSN0KUMz3bTsWlwWA88q+QYZ/gws/ksgUhkr9/6jIP3Jgx1BOhXfDaS0ARDzcaaQNNNziyKWJ0b5eAIyN9v8059yLjLybQxu+Iprp+y4AFKzryUufSIz29jmnC4yK2U9FG8d9POvMOyPpXV/JO/f/6LS9NBm/AXSliqnml5D4WDmiV5XedXshDOfJ4HsE/1QUu3tGAbwRwLsAvCsn21O5WIv9n+eTvDIN+65Iuve6vLNvNs49WprtH6KYGnnFKPLdkeyudUW9e0seAIJs/K/OFa4C7A9KRmRYEv2fpuHXACDn2R44/NwD9wF6diS7a315oUUyfa+RdJEP3G7l5sdGd/3igPSArgK0KR2Jft4An8xmc3VFsY1fO6kH0G2+zLPLtsNhwY0xLStDwI0m2p5tZDoJXWBAL5S91nhsi6R2fU1Y7tXN/GgtI5kHQa+Z8Evv+TDlmCpkR/Yqn5s79Ng5g8Vt1Mc6IXGlAa5yyVnr7/CC6Uul0RKpDtIoyAicTf/pudsfX/bs+bebXZtvsFck2j5h6W4L5N1mpU8Y0BZkvvN0HIs0XlSmfP3vySCbzEk9T8cxpuO19zS1cdTxeLqOYj3WqYnFk7/j7R+C3MO+MTc76WoQA3R4LBjd9YvlXdcnb+fpHcYLbT4vga6YA0ynaCRJFw5n9vcs6p1MOlqi687mSDC9BeETpVNpJKlQ2jUb6Os9n+tZgdX5fLz9cgt7t0/vCorWQjdKSMVG+26dzMmJJdHjlSezpLe58mF3Fd+Jg057d8iJ5Qf1zwOGWGW95euHtWFLoK9sw6Acmaz4XjnpAMwdAJYdrMurmEfLowdSjtpeSfS6Yzw7Vn9Rca6EVzGJ9rCxNSX6Dq/DL0kElZ63FSFdU5IwbqxXcB3zqM9VAN9XPb2xSt4lDvbhCIOb8rKvptht4TZVZfp/52E8dDx9+Z2m1MvSUZ/9hlxSPuoT5MmxTN81U0fZ//MXc6wEi1UAalO798nx55Q3Iyf33gi9H1G6j+BZ6er2V1oAK7HSX4mVfjEBvPKz0kwesOWjPw9+rseFAUA4ENl4+2WC223AEwleFDr7VhqcPRr4X9VBXE+Vf+Iy4ePrs1VtLzWGXRBigTGfzMu+mlAz4DGS7v1yhdh42o6vXwmYVSU/4kiiuSUC/xI5bAyMOVvE+0OrCzyjZ4Se9+2q4ce3Tx1fPwXaI4AbJtpe48AWA8ij+aJ17rJQdhuNmQ+YH0bTvfdVgPdpe1FINt7+QlJLLN3vovIvFrgsdOFbPGMWOPCH0XTv/VOAnQLtUYFbqOp4uaVOJLnTA75M8K68wi8QON3QZENrfxrP7t55uNKOp/BKpnzV9AWgeYGF+n1j9lPmWkC7QueuocHZor4TS/U/NKXHToF2XODmY61L6JkXWOc2+cWX3z1L0Ods8eV3Jxii9PI7/55Jv/yutqMhDO2ZxZffuTQdHge9V5JYIehaB3cPYOYVlL+uOrNv9y2At2IKsFOgnQhwU/Gm6T6CtxpoL+hFPeg9KO7N+r7Ae0AlIMQhjgja7eD6Iw5PDAdM15ZeM5rKp6N+GKmJGTWGHtoItUAMIDdiAfjE+YB5GaC/hnDXU2yHQSpI7bph6jWjU6CdtM5Z8ULnl4p4hoCdhjzOAMsltgD6q4h1lB4FGUIKAGMAGSeUckoZAs56NHkLZyFTTWqugPMAdAO4x0GrrVjwoCYBv556ofNU4VN9sPIVSUJTdT7hv1QyxxlpwBhUqXiQ7jMk1JMYccAeAnshpYoJF3AQ4iDqVTTumgVEDNAnYKMc7oWRDylB8q9BetftlZx+auqmQIu/A7zm4B6fjqowYc8RvDkGIIQMjHw4NotqhdDoiLri+wEgEVmKQ4T2EmYXiqePw1E1Rhpx0D2RTP/mSqNtirtOFT5dFR3OAVXdOq0AzDFiB8QkjDxYOhSPx4NA5xUzCzwjEFROwn5H7oxk3LbyqTaVHH1quqbK0wraSs5bApk97Hd/MNlZHRRUlXChD1IwYR5xl+G+famxFgH+Dl/vVJkC7VPWeTGG//Uo95ZDylNAnSr/O6AdB6CVBEzpqFNlqkyVf+7y/wHAjCz1gvM5bAAAAABJRU5ErkJggg==";
const CLRS=["#0ea5e9","#f59e0b","#10b981","#8b5cf6","#ef4444","#06b6d4","#ec4899","#84cc16","#f97316","#6366f1","#14b8a6","#a855f7"];

const SFIPS={AL:"01",AK:"02",AZ:"04",AR:"05",CA:"06",CO:"08",CT:"09",DE:"10",FL:"12",GA:"13",HI:"15",ID:"16",IL:"17",IN:"18",IA:"19",KS:"20",KY:"21",LA:"22",ME:"23",MD:"24",MA:"25",MI:"26",MN:"27",MS:"28",MO:"29",MT:"30",NE:"31",NV:"32",NH:"33",NJ:"34",NM:"35",NY:"36",NC:"37",ND:"38",OH:"39",OK:"40",OR:"41",PA:"42",RI:"44",SC:"45",SD:"46",TN:"47",TX:"48",UT:"49",VT:"50",VA:"51",WA:"53",WV:"54",WI:"55",WY:"56"};
const FSMAP=Object.fromEntries(Object.entries(SFIPS).map(([k,v])=>[v,k]));
const SNAME={NJ:"New Jersey",FL:"Florida",TX:"Texas",PA:"Pennsylvania",NC:"North Carolina",VA:"Virginia",CO:"Colorado",CT:"Connecticut",RI:"Rhode Island",NY:"New York",OH:"Ohio",DE:"Delaware",AZ:"Arizona",AL:"Alabama",MI:"Michigan",LA:"Louisiana",CA:"California",GA:"Georgia",SC:"South Carolina",TN:"Tennessee",WI:"Wisconsin"};
const RETENTION_DATA=JSON.parse("{\"snapshots\":[\"2024-04-21\",\"2024-05-28\",\"2024-06-28\",\"2024-07-31\",\"2024-08-30\",\"2024-09-30\",\"2024-10-28\",\"2024-11-26\",\"2024-12-23\",\"2025-01-30\",\"2025-02-25\",\"2025-03-31\",\"2025-04-29\",\"2025-05-30\",\"2025-06-30\",\"2025-07-31\",\"2025-08-28\",\"2025-09-30\",\"2025-10-31\",\"2025-11-25\",\"2025-12-31\",\"2026-01-30\",\"2026-02-27\",\"2026-03-31\",\"2026-04-14\",\"2026-04-21\",\"2026-04-28\"],\"global\":[{\"snap\":\"2024-04-21\",\"total\":5889,\"retained\":0,\"new\":5889,\"winback\":0,\"churned\":0,\"retRate\":0,\"chRate\":0},{\"snap\":\"2024-05-28\",\"total\":6022,\"retained\":5639,\"new\":383,\"winback\":0,\"churned\":250,\"retRate\":95.75,\"chRate\":4.25},{\"snap\":\"2024-06-28\",\"total\":6369,\"retained\":5910,\"new\":313,\"winback\":146,\"churned\":112,\"retRate\":98.14,\"chRate\":1.86},{\"snap\":\"2024-07-31\",\"total\":6609,\"retained\":6230,\"new\":374,\"winback\":5,\"churned\":139,\"retRate\":97.82,\"chRate\":2.18},{\"snap\":\"2024-08-30\",\"total\":6855,\"retained\":6496,\"new\":332,\"winback\":27,\"churned\":113,\"retRate\":98.29,\"chRate\":1.71},{\"snap\":\"2024-09-30\",\"total\":7100,\"retained\":6707,\"new\":373,\"winback\":20,\"churned\":148,\"retRate\":97.84,\"chRate\":2.16},{\"snap\":\"2024-10-28\",\"total\":7657,\"retained\":6880,\"new\":759,\"winback\":18,\"churned\":220,\"retRate\":96.9,\"chRate\":3.1},{\"snap\":\"2024-11-26\",\"total\":9349,\"retained\":7396,\"new\":1906,\"winback\":47,\"churned\":261,\"retRate\":96.59,\"chRate\":3.41},{\"snap\":\"2024-12-23\",\"total\":10010,\"retained\":9028,\"new\":949,\"winback\":33,\"churned\":321,\"retRate\":96.57,\"chRate\":3.43},{\"snap\":\"2025-01-30\",\"total\":10005,\"retained\":9583,\"new\":401,\"winback\":21,\"churned\":427,\"retRate\":95.73,\"chRate\":4.27},{\"snap\":\"2025-02-25\",\"total\":10430,\"retained\":9759,\"new\":652,\"winback\":19,\"churned\":246,\"retRate\":97.54,\"chRate\":2.46},{\"snap\":\"2025-03-31\",\"total\":11282,\"retained\":10168,\"new\":1085,\"winback\":29,\"churned\":262,\"retRate\":97.49,\"chRate\":2.51},{\"snap\":\"2025-04-29\",\"total\":12098,\"retained\":11091,\"new\":938,\"winback\":69,\"churned\":191,\"retRate\":98.31,\"chRate\":1.69},{\"snap\":\"2025-05-30\",\"total\":12921,\"retained\":11927,\"new\":960,\"winback\":34,\"churned\":171,\"retRate\":98.59,\"chRate\":1.41},{\"snap\":\"2025-06-30\",\"total\":13952,\"retained\":12723,\"new\":1205,\"winback\":24,\"churned\":198,\"retRate\":98.47,\"chRate\":1.53},{\"snap\":\"2025-07-31\",\"total\":14574,\"retained\":13736,\"new\":806,\"winback\":32,\"churned\":216,\"retRate\":98.45,\"chRate\":1.55},{\"snap\":\"2025-08-28\",\"total\":15517,\"retained\":14454,\"new\":969,\"winback\":94,\"churned\":120,\"retRate\":99.18,\"chRate\":0.82},{\"snap\":\"2025-09-30\",\"total\":16099,\"retained\":15345,\"new\":728,\"winback\":26,\"churned\":172,\"retRate\":98.89,\"chRate\":1.11},{\"snap\":\"2025-10-31\",\"total\":18173,\"retained\":15741,\"new\":2399,\"winback\":33,\"churned\":358,\"retRate\":97.78,\"chRate\":2.22},{\"snap\":\"2025-11-25\",\"total\":20075,\"retained\":17644,\"new\":2364,\"winback\":67,\"churned\":529,\"retRate\":97.09,\"chRate\":2.91},{\"snap\":\"2025-12-31\",\"total\":21827,\"retained\":19728,\"new\":1996,\"winback\":103,\"churned\":347,\"retRate\":98.27,\"chRate\":1.73},{\"snap\":\"2026-01-30\",\"total\":22532,\"retained\":21433,\"new\":1024,\"winback\":75,\"churned\":394,\"retRate\":98.19,\"chRate\":1.81},{\"snap\":\"2026-02-27\",\"total\":21434,\"retained\":20904,\"new\":472,\"winback\":58,\"churned\":1628,\"retRate\":92.77,\"chRate\":7.23},{\"snap\":\"2026-03-31\",\"total\":21391,\"retained\":20759,\"new\":551,\"winback\":81,\"churned\":675,\"retRate\":96.85,\"chRate\":3.15},{\"snap\":\"2026-04-14\",\"total\":21489,\"retained\":21237,\"new\":195,\"winback\":57,\"churned\":154,\"retRate\":99.28,\"chRate\":0.72},{\"snap\":\"2026-04-21\",\"total\":21553,\"retained\":21451,\"new\":87,\"winback\":15,\"churned\":38,\"retRate\":99.82,\"chRate\":0.18},{\"snap\":\"2026-04-28\",\"total\":21648,\"retained\":21489,\"new\":146,\"winback\":13,\"churned\":64,\"retRate\":99.7,\"chRate\":0.3}],\"byAgency\":[{\"snap\":\"2024-04-21\",\"agency\":\"AllCare Mar\",\"total\":3897,\"retained\":0,\"new\":3897,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"Concep Care\",\"total\":1476,\"retained\":0,\"new\":1476,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"GW Ins Group\",\"total\":331,\"retained\":0,\"new\":331,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":0,\"new\":10,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"KMRA Group\",\"total\":99,\"retained\":0,\"new\":99,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"Martell Multi\",\"total\":16,\"retained\":0,\"new\":16,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"Top Tier Health\",\"total\":59,\"retained\":0,\"new\":59,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"agency\":\"Unknown\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-05-28\",\"agency\":\"AllCare Mar\",\"total\":3856,\"retained\":3699,\"new\":157,\"winback\":0,\"churned\":198,\"retRate\":94.92},{\"snap\":\"2024-05-28\",\"agency\":\"Concep Care\",\"total\":1568,\"retained\":1448,\"new\":120,\"winback\":0,\"churned\":28,\"retRate\":98.1},{\"snap\":\"2024-05-28\",\"agency\":\"GW Ins Group\",\"total\":369,\"retained\":321,\"new\":48,\"winback\":0,\"churned\":10,\"retRate\":96.98},{\"snap\":\"2024-05-28\",\"agency\":\"Gandhi, Manish\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":4,\"retRate\":60.0},{\"snap\":\"2024-05-28\",\"agency\":\"KMRA Group\",\"total\":133,\"retained\":95,\"new\":38,\"winback\":0,\"churned\":4,\"retRate\":95.96},{\"snap\":\"2024-05-28\",\"agency\":\"Martell Multi\",\"total\":26,\"retained\":13,\"new\":13,\"winback\":0,\"churned\":3,\"retRate\":81.25},{\"snap\":\"2024-05-28\",\"agency\":\"Origin Insurance\",\"total\":2,\"retained\":0,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-05-28\",\"agency\":\"Top Tier Health\",\"total\":61,\"retained\":56,\"new\":5,\"winback\":0,\"churned\":3,\"retRate\":94.92},{\"snap\":\"2024-05-28\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"agency\":\"AllCare Mar\",\"total\":4063,\"retained\":3796,\"new\":129,\"winback\":138,\"churned\":60,\"retRate\":98.44},{\"snap\":\"2024-06-28\",\"agency\":\"Concep Care\",\"total\":1638,\"retained\":1536,\"new\":99,\"winback\":3,\"churned\":32,\"retRate\":97.96},{\"snap\":\"2024-06-28\",\"agency\":\"GW Ins Group\",\"total\":386,\"retained\":359,\"new\":26,\"winback\":1,\"churned\":10,\"retRate\":97.29},{\"snap\":\"2024-06-28\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":6,\"new\":0,\"winback\":4,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"agency\":\"KMRA Group\",\"total\":169,\"retained\":126,\"new\":43,\"winback\":0,\"churned\":7,\"retRate\":94.74},{\"snap\":\"2024-06-28\",\"agency\":\"Martell Multi\",\"total\":33,\"retained\":26,\"new\":7,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"agency\":\"Origin Insurance\",\"total\":8,\"retained\":2,\"new\":6,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"agency\":\"Top Tier Health\",\"total\":61,\"retained\":58,\"new\":3,\"winback\":0,\"churned\":3,\"retRate\":95.08},{\"snap\":\"2024-06-28\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-07-31\",\"agency\":\"AllCare Mar\",\"total\":4112,\"retained\":3980,\"new\":130,\"winback\":2,\"churned\":83,\"retRate\":97.96},{\"snap\":\"2024-07-31\",\"agency\":\"Concep Care\",\"total\":1769,\"retained\":1596,\"new\":172,\"winback\":1,\"churned\":42,\"retRate\":97.44},{\"snap\":\"2024-07-31\",\"agency\":\"GW Ins Group\",\"total\":416,\"retained\":380,\"new\":36,\"winback\":0,\"churned\":6,\"retRate\":98.45},{\"snap\":\"2024-07-31\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":10,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-07-31\",\"agency\":\"KMRA Group\",\"total\":189,\"retained\":162,\"new\":26,\"winback\":1,\"churned\":7,\"retRate\":95.86},{\"snap\":\"2024-07-31\",\"agency\":\"Martell Multi\",\"total\":42,\"retained\":32,\"new\":10,\"winback\":0,\"churned\":1,\"retRate\":96.97},{\"snap\":\"2024-07-31\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":7,\"new\":4,\"winback\":0,\"churned\":1,\"retRate\":87.5},{\"snap\":\"2024-07-31\",\"agency\":\"Top Tier Health\",\"total\":59,\"retained\":59,\"new\":0,\"winback\":0,\"churned\":2,\"retRate\":96.72},{\"snap\":\"2024-07-31\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"agency\":\"AllCare Mar\",\"total\":4216,\"retained\":4044,\"new\":152,\"winback\":20,\"churned\":68,\"retRate\":98.35},{\"snap\":\"2024-08-30\",\"agency\":\"Concep Care\",\"total\":1857,\"retained\":1738,\"new\":115,\"winback\":4,\"churned\":31,\"retRate\":98.25},{\"snap\":\"2024-08-30\",\"agency\":\"GW Ins Group\",\"total\":448,\"retained\":413,\"new\":35,\"winback\":0,\"churned\":3,\"retRate\":99.28},{\"snap\":\"2024-08-30\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":10,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"agency\":\"KMRA Group\",\"total\":201,\"retained\":176,\"new\":24,\"winback\":1,\"churned\":13,\"retRate\":93.12},{\"snap\":\"2024-08-30\",\"agency\":\"Martell Multi\",\"total\":47,\"retained\":41,\"new\":6,\"winback\":0,\"churned\":1,\"retRate\":97.62},{\"snap\":\"2024-08-30\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"agency\":\"Top Tier Health\",\"total\":64,\"retained\":59,\"new\":4,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"agency\":\"AllCare Mar\",\"total\":4332,\"retained\":4127,\"new\":196,\"winback\":9,\"churned\":89,\"retRate\":97.89},{\"snap\":\"2024-09-30\",\"agency\":\"Concep Care\",\"total\":1946,\"retained\":1823,\"new\":117,\"winback\":6,\"churned\":34,\"retRate\":98.17},{\"snap\":\"2024-09-30\",\"agency\":\"GW Ins Group\",\"total\":467,\"retained\":433,\"new\":33,\"winback\":1,\"churned\":15,\"retRate\":96.65},{\"snap\":\"2024-09-30\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":10,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"agency\":\"KMRA Group\",\"total\":212,\"retained\":196,\"new\":13,\"winback\":3,\"churned\":5,\"retRate\":97.51},{\"snap\":\"2024-09-30\",\"agency\":\"Martell Multi\",\"total\":57,\"retained\":45,\"new\":12,\"winback\":0,\"churned\":2,\"retRate\":95.74},{\"snap\":\"2024-09-30\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"agency\":\"Top Tier Health\",\"total\":64,\"retained\":61,\"new\":3,\"winback\":0,\"churned\":3,\"retRate\":95.31},{\"snap\":\"2024-09-30\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"agency\":\"AllCare Mar\",\"total\":4550,\"retained\":4190,\"new\":351,\"winback\":9,\"churned\":142,\"retRate\":96.72},{\"snap\":\"2024-10-28\",\"agency\":\"Concep Care\",\"total\":2164,\"retained\":1887,\"new\":270,\"winback\":7,\"churned\":59,\"retRate\":96.97},{\"snap\":\"2024-10-28\",\"agency\":\"GW Ins Group\",\"total\":513,\"retained\":451,\"new\":58,\"winback\":4,\"churned\":16,\"retRate\":96.57},{\"snap\":\"2024-10-28\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":10,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"agency\":\"KMRA Group\",\"total\":263,\"retained\":208,\"new\":55,\"winback\":0,\"churned\":4,\"retRate\":98.11},{\"snap\":\"2024-10-28\",\"agency\":\"Martell Multi\",\"total\":69,\"retained\":53,\"new\":16,\"winback\":0,\"churned\":4,\"retRate\":92.98},{\"snap\":\"2024-10-28\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"agency\":\"Top Tier Health\",\"total\":75,\"retained\":62,\"new\":13,\"winback\":0,\"churned\":2,\"retRate\":96.88},{\"snap\":\"2024-10-28\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"agency\":\"AllCare Mar\",\"total\":5271,\"retained\":4412,\"new\":831,\"winback\":28,\"churned\":138,\"retRate\":96.97},{\"snap\":\"2024-11-26\",\"agency\":\"Concep Care\",\"total\":2911,\"retained\":2070,\"new\":831,\"winback\":10,\"churned\":94,\"retRate\":95.66},{\"snap\":\"2024-11-26\",\"agency\":\"GW Ins Group\",\"total\":597,\"retained\":495,\"new\":97,\"winback\":5,\"churned\":18,\"retRate\":96.49},{\"snap\":\"2024-11-26\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"agency\":\"KMRA Group\",\"total\":318,\"retained\":250,\"new\":66,\"winback\":2,\"churned\":13,\"retRate\":95.06},{\"snap\":\"2024-11-26\",\"agency\":\"Martell Multi\",\"total\":107,\"retained\":68,\"new\":39,\"winback\":0,\"churned\":1,\"retRate\":98.55},{\"snap\":\"2024-11-26\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"agency\":\"Top Tier Health\",\"total\":122,\"retained\":70,\"new\":52,\"winback\":0,\"churned\":5,\"retRate\":93.33},{\"snap\":\"2024-11-26\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"agency\":\"AllCare Mar\",\"total\":5618,\"retained\":5090,\"new\":509,\"winback\":19,\"churned\":181,\"retRate\":96.57},{\"snap\":\"2024-12-23\",\"agency\":\"Concep Care\",\"total\":3070,\"retained\":2805,\"new\":258,\"winback\":7,\"churned\":106,\"retRate\":96.36},{\"snap\":\"2024-12-23\",\"agency\":\"GW Ins Group\",\"total\":656,\"retained\":582,\"new\":70,\"winback\":4,\"churned\":15,\"retRate\":97.49},{\"snap\":\"2024-12-23\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"agency\":\"KMRA Group\",\"total\":360,\"retained\":304,\"new\":54,\"winback\":2,\"churned\":14,\"retRate\":95.6},{\"snap\":\"2024-12-23\",\"agency\":\"Martell Multi\",\"total\":126,\"retained\":101,\"new\":25,\"winback\":0,\"churned\":6,\"retRate\":94.39},{\"snap\":\"2024-12-23\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"agency\":\"Top Tier Health\",\"total\":157,\"retained\":118,\"new\":39,\"winback\":0,\"churned\":4,\"retRate\":96.72},{\"snap\":\"2024-12-23\",\"agency\":\"Unknown\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-01-30\",\"agency\":\"AllCare Mar\",\"total\":5630,\"retained\":5380,\"new\":237,\"winback\":13,\"churned\":238,\"retRate\":95.76},{\"snap\":\"2025-01-30\",\"agency\":\"Concep Care\",\"total\":3046,\"retained\":2949,\"new\":92,\"winback\":5,\"churned\":121,\"retRate\":96.06},{\"snap\":\"2025-01-30\",\"agency\":\"GW Ins Group\",\"total\":655,\"retained\":621,\"new\":32,\"winback\":2,\"churned\":35,\"retRate\":94.66},{\"snap\":\"2025-01-30\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-01-30\",\"agency\":\"KMRA Group\",\"total\":353,\"retained\":338,\"new\":15,\"winback\":0,\"churned\":22,\"retRate\":93.89},{\"snap\":\"2025-01-30\",\"agency\":\"Martell Multi\",\"total\":123,\"retained\":118,\"new\":5,\"winback\":0,\"churned\":8,\"retRate\":93.65},{\"snap\":\"2025-01-30\",\"agency\":\"Origin Insurance\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-01-30\",\"agency\":\"Top Tier Health\",\"total\":176,\"retained\":151,\"new\":24,\"winback\":1,\"churned\":6,\"retRate\":96.18},{\"snap\":\"2025-02-25\",\"agency\":\"AllCare Mar\",\"total\":5793,\"retained\":5493,\"new\":290,\"winback\":10,\"churned\":137,\"retRate\":97.57},{\"snap\":\"2025-02-25\",\"agency\":\"Concep Care\",\"total\":3192,\"retained\":2981,\"new\":205,\"winback\":6,\"churned\":65,\"retRate\":97.87},{\"snap\":\"2025-02-25\",\"agency\":\"GW Ins Group\",\"total\":662,\"retained\":639,\"new\":21,\"winback\":2,\"churned\":16,\"retRate\":97.56},{\"snap\":\"2025-02-25\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-02-25\",\"agency\":\"KMRA Group\",\"total\":355,\"retained\":338,\"new\":16,\"winback\":1,\"churned\":15,\"retRate\":95.75},{\"snap\":\"2025-02-25\",\"agency\":\"Martell Multi\",\"total\":221,\"retained\":113,\"new\":108,\"winback\":0,\"churned\":10,\"retRate\":91.87},{\"snap\":\"2025-02-25\",\"agency\":\"Top Tier Health\",\"total\":196,\"retained\":172,\"new\":24,\"winback\":0,\"churned\":4,\"retRate\":97.73},{\"snap\":\"2025-03-31\",\"agency\":\"AllCare Mar\",\"total\":6119,\"retained\":5633,\"new\":466,\"winback\":20,\"churned\":160,\"retRate\":97.24},{\"snap\":\"2025-03-31\",\"agency\":\"Concep Care\",\"total\":3382,\"retained\":3122,\"new\":258,\"winback\":2,\"churned\":70,\"retRate\":97.81},{\"snap\":\"2025-03-31\",\"agency\":\"GW Ins Group\",\"total\":684,\"retained\":638,\"new\":44,\"winback\":2,\"churned\":24,\"retRate\":96.37},{\"snap\":\"2025-03-31\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-03-31\",\"agency\":\"KMRA Group\",\"total\":386,\"retained\":346,\"new\":37,\"winback\":3,\"churned\":9,\"retRate\":97.46},{\"snap\":\"2025-03-31\",\"agency\":\"Martell Multi\",\"total\":331,\"retained\":216,\"new\":113,\"winback\":2,\"churned\":5,\"retRate\":97.74},{\"snap\":\"2025-03-31\",\"agency\":\"Simarova Senior\",\"total\":68,\"retained\":0,\"new\":68,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-03-31\",\"agency\":\"TCS & Associates\",\"total\":89,\"retained\":0,\"new\":89,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-03-31\",\"agency\":\"Top Tier Health\",\"total\":212,\"retained\":193,\"new\":19,\"winback\":0,\"churned\":3,\"retRate\":98.47},{\"snap\":\"2025-04-29\",\"agency\":\"AMC Care Group\",\"total\":8,\"retained\":0,\"new\":8,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-04-29\",\"agency\":\"AllCare Mar\",\"total\":6395,\"retained\":5990,\"new\":360,\"winback\":45,\"churned\":129,\"retRate\":97.89},{\"snap\":\"2025-04-29\",\"agency\":\"Concep Care\",\"total\":3550,\"retained\":3328,\"new\":214,\"winback\":8,\"churned\":54,\"retRate\":98.4},{\"snap\":\"2025-04-29\",\"agency\":\"GW Ins Group\",\"total\":711,\"retained\":669,\"new\":35,\"winback\":7,\"churned\":15,\"retRate\":97.81},{\"snap\":\"2025-04-29\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-04-29\",\"agency\":\"KMRA Group\",\"total\":396,\"retained\":379,\"new\":14,\"winback\":3,\"churned\":7,\"retRate\":98.19},{\"snap\":\"2025-04-29\",\"agency\":\"Martell Multi\",\"total\":367,\"retained\":326,\"new\":41,\"winback\":0,\"churned\":5,\"retRate\":98.49},{\"snap\":\"2025-04-29\",\"agency\":\"Simarova Senior\",\"total\":248,\"retained\":68,\"new\":180,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-04-29\",\"agency\":\"TCS & Associates\",\"total\":187,\"retained\":88,\"new\":99,\"winback\":0,\"churned\":1,\"retRate\":98.88},{\"snap\":\"2025-04-29\",\"agency\":\"Top Tier Health\",\"total\":225,\"retained\":211,\"new\":14,\"winback\":0,\"churned\":1,\"retRate\":99.53},{\"snap\":\"2025-05-30\",\"agency\":\"AMC Care Group\",\"total\":13,\"retained\":8,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"agency\":\"AllCare Mar\",\"total\":6615,\"retained\":6308,\"new\":287,\"winback\":20,\"churned\":87,\"retRate\":98.64},{\"snap\":\"2025-05-30\",\"agency\":\"Concep Care\",\"total\":3746,\"retained\":3495,\"new\":243,\"winback\":8,\"churned\":55,\"retRate\":98.45},{\"snap\":\"2025-05-30\",\"agency\":\"GW Ins Group\",\"total\":731,\"retained\":700,\"new\":29,\"winback\":2,\"churned\":11,\"retRate\":98.45},{\"snap\":\"2025-05-30\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"agency\":\"JPM Solutions\",\"total\":3,\"retained\":0,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-05-30\",\"agency\":\"KMRA Group\",\"total\":412,\"retained\":384,\"new\":27,\"winback\":1,\"churned\":12,\"retRate\":96.97},{\"snap\":\"2025-05-30\",\"agency\":\"Martell Multi\",\"total\":417,\"retained\":361,\"new\":56,\"winback\":0,\"churned\":6,\"retRate\":98.37},{\"snap\":\"2025-05-30\",\"agency\":\"Simarova Senior\",\"total\":434,\"retained\":246,\"new\":188,\"winback\":0,\"churned\":2,\"retRate\":99.19},{\"snap\":\"2025-05-30\",\"agency\":\"TCS & Associates\",\"total\":293,\"retained\":181,\"new\":112,\"winback\":0,\"churned\":6,\"retRate\":96.79},{\"snap\":\"2025-05-30\",\"agency\":\"Top Tier Health\",\"total\":246,\"retained\":223,\"new\":23,\"winback\":0,\"churned\":2,\"retRate\":99.11},{\"snap\":\"2025-06-30\",\"agency\":\"AMC Care Group\",\"total\":77,\"retained\":13,\"new\":64,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"agency\":\"AllCare Mar\",\"total\":6877,\"retained\":6482,\"new\":381,\"winback\":14,\"churned\":133,\"retRate\":97.99},{\"snap\":\"2025-06-30\",\"agency\":\"Concep Care\",\"total\":3954,\"retained\":3684,\"new\":266,\"winback\":4,\"churned\":62,\"retRate\":98.34},{\"snap\":\"2025-06-30\",\"agency\":\"GW Ins Group\",\"total\":802,\"retained\":721,\"new\":79,\"winback\":2,\"churned\":10,\"retRate\":98.63},{\"snap\":\"2025-06-30\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"agency\":\"JPM Solutions\",\"total\":6,\"retained\":3,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"agency\":\"KMRA Group\",\"total\":457,\"retained\":400,\"new\":57,\"winback\":0,\"churned\":12,\"retRate\":97.09},{\"snap\":\"2025-06-30\",\"agency\":\"Martell Multi\",\"total\":475,\"retained\":415,\"new\":58,\"winback\":2,\"churned\":2,\"retRate\":99.52},{\"snap\":\"2025-06-30\",\"agency\":\"Simarova Senior\",\"total\":583,\"retained\":431,\"new\":151,\"winback\":1,\"churned\":3,\"retRate\":99.31},{\"snap\":\"2025-06-30\",\"agency\":\"TCS & Associates\",\"total\":429,\"retained\":286,\"new\":143,\"winback\":0,\"churned\":7,\"retRate\":97.61},{\"snap\":\"2025-06-30\",\"agency\":\"Top Tier Health\",\"total\":281,\"retained\":236,\"new\":45,\"winback\":0,\"churned\":10,\"retRate\":95.93},{\"snap\":\"2025-07-31\",\"agency\":\"AMC Care Group\",\"total\":117,\"retained\":77,\"new\":40,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"agency\":\"AllCare Mar\",\"total\":7137,\"retained\":6780,\"new\":339,\"winback\":18,\"churned\":97,\"retRate\":98.59},{\"snap\":\"2025-07-31\",\"agency\":\"Concep Care\",\"total\":4052,\"retained\":3892,\"new\":154,\"winback\":6,\"churned\":62,\"retRate\":98.43},{\"snap\":\"2025-07-31\",\"agency\":\"GW Ins Group\",\"total\":863,\"retained\":784,\"new\":77,\"winback\":2,\"churned\":18,\"retRate\":97.76},{\"snap\":\"2025-07-31\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"agency\":\"JPM Solutions\",\"total\":17,\"retained\":6,\"new\":11,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"agency\":\"KMRA Group\",\"total\":471,\"retained\":449,\"new\":21,\"winback\":1,\"churned\":8,\"retRate\":98.25},{\"snap\":\"2025-07-31\",\"agency\":\"Martell Multi\",\"total\":517,\"retained\":469,\"new\":48,\"winback\":0,\"churned\":6,\"retRate\":98.74},{\"snap\":\"2025-07-31\",\"agency\":\"Simarova Senior\",\"total\":638,\"retained\":570,\"new\":68,\"winback\":0,\"churned\":13,\"retRate\":97.77},{\"snap\":\"2025-07-31\",\"agency\":\"TCS & Associates\",\"total\":467,\"retained\":417,\"new\":49,\"winback\":1,\"churned\":12,\"retRate\":97.2},{\"snap\":\"2025-07-31\",\"agency\":\"Top Tier Health\",\"total\":284,\"retained\":271,\"new\":12,\"winback\":1,\"churned\":10,\"retRate\":96.44},{\"snap\":\"2025-08-28\",\"agency\":\"AMC Care Group\",\"total\":211,\"retained\":117,\"new\":94,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"agency\":\"AllCare Mar\",\"total\":7467,\"retained\":7065,\"new\":369,\"winback\":33,\"churned\":72,\"retRate\":98.99},{\"snap\":\"2025-08-28\",\"agency\":\"Concep Care\",\"total\":4198,\"retained\":4018,\"new\":152,\"winback\":28,\"churned\":34,\"retRate\":99.16},{\"snap\":\"2025-08-28\",\"agency\":\"GW Ins Group\",\"total\":954,\"retained\":845,\"new\":95,\"winback\":14,\"churned\":18,\"retRate\":97.91},{\"snap\":\"2025-08-28\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"agency\":\"JPM Solutions\",\"total\":34,\"retained\":17,\"new\":17,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"agency\":\"KMRA Group\",\"total\":548,\"retained\":466,\"new\":74,\"winback\":8,\"churned\":5,\"retRate\":98.94},{\"snap\":\"2025-08-28\",\"agency\":\"Martell Multi\",\"total\":511,\"retained\":508,\"new\":2,\"winback\":1,\"churned\":9,\"retRate\":98.26},{\"snap\":\"2025-08-28\",\"agency\":\"Simarova Senior\",\"total\":774,\"retained\":633,\"new\":137,\"winback\":4,\"churned\":5,\"retRate\":99.22},{\"snap\":\"2025-08-28\",\"agency\":\"TCS & Associates\",\"total\":498,\"retained\":459,\"new\":36,\"winback\":3,\"churned\":8,\"retRate\":98.29},{\"snap\":\"2025-08-28\",\"agency\":\"Top Tier Health\",\"total\":310,\"retained\":281,\"new\":27,\"winback\":2,\"churned\":3,\"retRate\":98.94},{\"snap\":\"2025-08-28\",\"agency\":\"Unknown\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-09-30\",\"agency\":\"AMC Care Group\",\"total\":281,\"retained\":211,\"new\":70,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"agency\":\"AllCare Mar\",\"total\":7639,\"retained\":7368,\"new\":259,\"winback\":12,\"churned\":99,\"retRate\":98.67},{\"snap\":\"2025-09-30\",\"agency\":\"Concep Care\",\"total\":4275,\"retained\":4137,\"new\":135,\"winback\":3,\"churned\":61,\"retRate\":98.55},{\"snap\":\"2025-09-30\",\"agency\":\"GW Ins Group\",\"total\":1036,\"retained\":945,\"new\":88,\"winback\":3,\"churned\":9,\"retRate\":99.06},{\"snap\":\"2025-09-30\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"agency\":\"JPM Solutions\",\"total\":46,\"retained\":34,\"new\":12,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"agency\":\"KMRA Group\",\"total\":589,\"retained\":536,\"new\":52,\"winback\":1,\"churned\":12,\"retRate\":97.81},{\"snap\":\"2025-09-30\",\"agency\":\"Martell Multi\",\"total\":465,\"retained\":465,\"new\":0,\"winback\":0,\"churned\":46,\"retRate\":91.0},{\"snap\":\"2025-09-30\",\"agency\":\"Simarova Senior\",\"total\":879,\"retained\":770,\"new\":107,\"winback\":2,\"churned\":4,\"retRate\":99.48},{\"snap\":\"2025-09-30\",\"agency\":\"TCS & Associates\",\"total\":559,\"retained\":495,\"new\":59,\"winback\":5,\"churned\":3,\"retRate\":99.4},{\"snap\":\"2025-09-30\",\"agency\":\"Top Tier Health\",\"total\":319,\"retained\":306,\"new\":11,\"winback\":2,\"churned\":4,\"retRate\":98.71},{\"snap\":\"2025-10-31\",\"agency\":\"AMC Care Group\",\"total\":435,\"retained\":272,\"new\":163,\"winback\":0,\"churned\":9,\"retRate\":96.8},{\"snap\":\"2025-10-31\",\"agency\":\"AllCare Mar\",\"total\":8039,\"retained\":7326,\"new\":703,\"winback\":10,\"churned\":313,\"retRate\":95.9},{\"snap\":\"2025-10-31\",\"agency\":\"Concep Care\",\"total\":4745,\"retained\":4153,\"new\":584,\"winback\":8,\"churned\":122,\"retRate\":97.15},{\"snap\":\"2025-10-31\",\"agency\":\"GW Ins Group\",\"total\":1269,\"retained\":1009,\"new\":240,\"winback\":20,\"churned\":27,\"retRate\":97.39},{\"snap\":\"2025-10-31\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-10-31\",\"agency\":\"JPM Solutions\",\"total\":90,\"retained\":43,\"new\":47,\"winback\":0,\"churned\":3,\"retRate\":93.48},{\"snap\":\"2025-10-31\",\"agency\":\"KMRA Group\",\"total\":730,\"retained\":568,\"new\":162,\"winback\":0,\"churned\":21,\"retRate\":96.43},{\"snap\":\"2025-10-31\",\"agency\":\"Martell Multi\",\"total\":737,\"retained\":448,\"new\":244,\"winback\":45,\"churned\":17,\"retRate\":96.34},{\"snap\":\"2025-10-31\",\"agency\":\"Simarova Senior\",\"total\":1054,\"retained\":867,\"new\":186,\"winback\":1,\"churned\":12,\"retRate\":98.63},{\"snap\":\"2025-10-31\",\"agency\":\"TCS & Associates\",\"total\":717,\"retained\":548,\"new\":169,\"winback\":0,\"churned\":11,\"retRate\":98.03},{\"snap\":\"2025-10-31\",\"agency\":\"Top Tier Health\",\"total\":346,\"retained\":311,\"new\":35,\"winback\":0,\"churned\":8,\"retRate\":97.49},{\"snap\":\"2025-11-25\",\"agency\":\"AMC Care Group\",\"total\":546,\"retained\":421,\"new\":124,\"winback\":1,\"churned\":14,\"retRate\":96.78},{\"snap\":\"2025-11-25\",\"agency\":\"AllCare Mar\",\"total\":8478,\"retained\":7762,\"new\":694,\"winback\":22,\"churned\":277,\"retRate\":96.55},{\"snap\":\"2025-11-25\",\"agency\":\"Concep Care\",\"total\":5228,\"retained\":4596,\"new\":625,\"winback\":7,\"churned\":149,\"retRate\":96.86},{\"snap\":\"2025-11-25\",\"agency\":\"GW Ins Group\",\"total\":1442,\"retained\":1233,\"new\":204,\"winback\":5,\"churned\":36,\"retRate\":97.16},{\"snap\":\"2025-11-25\",\"agency\":\"Gandhi, Manish\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-11-25\",\"agency\":\"JPM Solutions\",\"total\":113,\"retained\":87,\"new\":25,\"winback\":1,\"churned\":3,\"retRate\":96.67},{\"snap\":\"2025-11-25\",\"agency\":\"KMRA Group\",\"total\":868,\"retained\":709,\"new\":150,\"winback\":9,\"churned\":21,\"retRate\":97.12},{\"snap\":\"2025-11-25\",\"agency\":\"Martell Multi\",\"total\":926,\"retained\":722,\"new\":192,\"winback\":12,\"churned\":15,\"retRate\":97.96},{\"snap\":\"2025-11-25\",\"agency\":\"Origin Insurance\",\"total\":7,\"retained\":0,\"new\":0,\"winback\":7,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-11-25\",\"agency\":\"Simarova Senior\",\"total\":1246,\"retained\":1031,\"new\":214,\"winback\":1,\"churned\":23,\"retRate\":97.82},{\"snap\":\"2025-11-25\",\"agency\":\"TCS & Associates\",\"total\":816,\"retained\":697,\"new\":118,\"winback\":1,\"churned\":20,\"retRate\":97.21},{\"snap\":\"2025-11-25\",\"agency\":\"Top Tier Health\",\"total\":394,\"retained\":329,\"new\":63,\"winback\":2,\"churned\":17,\"retRate\":95.09},{\"snap\":\"2025-12-31\",\"agency\":\"AMC Care Group\",\"total\":680,\"retained\":538,\"new\":140,\"winback\":2,\"churned\":8,\"retRate\":98.53},{\"snap\":\"2025-12-31\",\"agency\":\"AllCare Mar\",\"total\":8986,\"retained\":8305,\"new\":638,\"winback\":43,\"churned\":173,\"retRate\":97.96},{\"snap\":\"2025-12-31\",\"agency\":\"Concep Care\",\"total\":5611,\"retained\":5164,\"new\":415,\"winback\":32,\"churned\":64,\"retRate\":98.78},{\"snap\":\"2025-12-31\",\"agency\":\"GW Ins Group\",\"total\":1611,\"retained\":1411,\"new\":193,\"winback\":7,\"churned\":31,\"retRate\":97.85},{\"snap\":\"2025-12-31\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":10,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":90.91},{\"snap\":\"2025-12-31\",\"agency\":\"JPM Solutions\",\"total\":140,\"retained\":108,\"new\":31,\"winback\":1,\"churned\":5,\"retRate\":95.58},{\"snap\":\"2025-12-31\",\"agency\":\"KMRA Group\",\"total\":1025,\"retained\":853,\"new\":167,\"winback\":5,\"churned\":15,\"retRate\":98.27},{\"snap\":\"2025-12-31\",\"agency\":\"Martell Multi\",\"total\":1014,\"retained\":892,\"new\":121,\"winback\":1,\"churned\":34,\"retRate\":96.33},{\"snap\":\"2025-12-31\",\"agency\":\"Origin Insurance\",\"total\":7,\"retained\":7,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-12-31\",\"agency\":\"Simarova Senior\",\"total\":1422,\"retained\":1228,\"new\":186,\"winback\":8,\"churned\":18,\"retRate\":98.56},{\"snap\":\"2025-12-31\",\"agency\":\"TCS & Associates\",\"total\":919,\"retained\":801,\"new\":116,\"winback\":2,\"churned\":15,\"retRate\":98.16},{\"snap\":\"2025-12-31\",\"agency\":\"Top Tier Health\",\"total\":402,\"retained\":383,\"new\":19,\"winback\":0,\"churned\":11,\"retRate\":97.21},{\"snap\":\"2026-01-30\",\"agency\":\"AMC Care Group\",\"total\":707,\"retained\":670,\"new\":32,\"winback\":5,\"churned\":10,\"retRate\":98.53},{\"snap\":\"2026-01-30\",\"agency\":\"AllCare Mar\",\"total\":9151,\"retained\":8800,\"new\":321,\"winback\":30,\"churned\":186,\"retRate\":97.93},{\"snap\":\"2026-01-30\",\"agency\":\"Concep Care\",\"total\":5658,\"retained\":5521,\"new\":129,\"winback\":8,\"churned\":90,\"retRate\":98.4},{\"snap\":\"2026-01-30\",\"agency\":\"GW Ins Group\",\"total\":1708,\"retained\":1567,\"new\":131,\"winback\":10,\"churned\":44,\"retRate\":97.27},{\"snap\":\"2026-01-30\",\"agency\":\"Gandhi, Manish\",\"total\":10,\"retained\":10,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-01-30\",\"agency\":\"JPM Solutions\",\"total\":162,\"retained\":139,\"new\":22,\"winback\":1,\"churned\":1,\"retRate\":99.29},{\"snap\":\"2026-01-30\",\"agency\":\"KMRA Group\",\"total\":1120,\"retained\":1012,\"new\":105,\"winback\":3,\"churned\":13,\"retRate\":98.73},{\"snap\":\"2026-01-30\",\"agency\":\"Martell Multi\",\"total\":1056,\"retained\":994,\"new\":56,\"winback\":6,\"churned\":20,\"retRate\":98.03},{\"snap\":\"2026-01-30\",\"agency\":\"Origin Insurance\",\"total\":7,\"retained\":7,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-01-30\",\"agency\":\"Simarova Senior\",\"total\":1552,\"retained\":1398,\"new\":152,\"winback\":2,\"churned\":24,\"retRate\":98.31},{\"snap\":\"2026-01-30\",\"agency\":\"TCS & Associates\",\"total\":984,\"retained\":904,\"new\":74,\"winback\":6,\"churned\":15,\"retRate\":98.37},{\"snap\":\"2026-01-30\",\"agency\":\"Top Tier Health\",\"total\":417,\"retained\":391,\"new\":24,\"winback\":2,\"churned\":11,\"retRate\":97.26},{\"snap\":\"2026-02-27\",\"agency\":\"AMC Care Group\",\"total\":726,\"retained\":687,\"new\":37,\"winback\":2,\"churned\":20,\"retRate\":97.17},{\"snap\":\"2026-02-27\",\"agency\":\"AllCare Mar\",\"total\":8518,\"retained\":8356,\"new\":149,\"winback\":13,\"churned\":795,\"retRate\":91.31},{\"snap\":\"2026-02-27\",\"agency\":\"Concep Care\",\"total\":5367,\"retained\":5292,\"new\":66,\"winback\":9,\"churned\":366,\"retRate\":93.53},{\"snap\":\"2026-02-27\",\"agency\":\"GW Ins Group\",\"total\":1625,\"retained\":1569,\"new\":42,\"winback\":14,\"churned\":139,\"retRate\":91.86},{\"snap\":\"2026-02-27\",\"agency\":\"Gandhi, Manish\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":5,\"retRate\":50.0},{\"snap\":\"2026-02-27\",\"agency\":\"JPM Solutions\",\"total\":171,\"retained\":157,\"new\":14,\"winback\":0,\"churned\":5,\"retRate\":96.91},{\"snap\":\"2026-02-27\",\"agency\":\"KMRA Group\",\"total\":1109,\"retained\":1058,\"new\":51,\"winback\":0,\"churned\":62,\"retRate\":94.46},{\"snap\":\"2026-02-27\",\"agency\":\"Martell Multi\",\"total\":1023,\"retained\":987,\"new\":33,\"winback\":3,\"churned\":69,\"retRate\":93.47},{\"snap\":\"2026-02-27\",\"agency\":\"NextGen Health\",\"total\":3,\"retained\":0,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2026-02-27\",\"agency\":\"Origin Insurance\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":85.71},{\"snap\":\"2026-02-27\",\"agency\":\"Simarova Senior\",\"total\":1559,\"retained\":1489,\"new\":65,\"winback\":5,\"churned\":63,\"retRate\":95.94},{\"snap\":\"2026-02-27\",\"agency\":\"TCS & Associates\",\"total\":970,\"retained\":931,\"new\":38,\"winback\":1,\"churned\":53,\"retRate\":94.61},{\"snap\":\"2026-02-27\",\"agency\":\"Top Tier Health\",\"total\":352,\"retained\":342,\"new\":7,\"winback\":3,\"churned\":75,\"retRate\":82.01},{\"snap\":\"2026-03-31\",\"agency\":\"AMC Care Group\",\"total\":725,\"retained\":705,\"new\":19,\"winback\":1,\"churned\":21,\"retRate\":97.11},{\"snap\":\"2026-03-31\",\"agency\":\"AllCare Mar\",\"total\":8357,\"retained\":8180,\"new\":149,\"winback\":28,\"churned\":338,\"retRate\":96.03},{\"snap\":\"2026-03-31\",\"agency\":\"Concep Care\",\"total\":5364,\"retained\":5222,\"new\":116,\"winback\":26,\"churned\":145,\"retRate\":97.3},{\"snap\":\"2026-03-31\",\"agency\":\"GW Ins Group\",\"total\":1640,\"retained\":1578,\"new\":51,\"winback\":11,\"churned\":47,\"retRate\":97.11},{\"snap\":\"2026-03-31\",\"agency\":\"Gandhi, Manish\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-03-31\",\"agency\":\"JPM Solutions\",\"total\":191,\"retained\":169,\"new\":22,\"winback\":0,\"churned\":2,\"retRate\":98.83},{\"snap\":\"2026-03-31\",\"agency\":\"KMRA Group\",\"total\":1124,\"retained\":1072,\"new\":50,\"winback\":2,\"churned\":37,\"retRate\":96.66},{\"snap\":\"2026-03-31\",\"agency\":\"Martell Multi\",\"total\":1038,\"retained\":994,\"new\":44,\"winback\":0,\"churned\":29,\"retRate\":97.17},{\"snap\":\"2026-03-31\",\"agency\":\"NextGen Health\",\"total\":4,\"retained\":3,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-03-31\",\"agency\":\"Origin Insurance\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":83.33},{\"snap\":\"2026-03-31\",\"agency\":\"Simarova Senior\",\"total\":1607,\"retained\":1515,\"new\":88,\"winback\":4,\"churned\":44,\"retRate\":97.18},{\"snap\":\"2026-03-31\",\"agency\":\"TCS & Associates\",\"total\":972,\"retained\":945,\"new\":24,\"winback\":3,\"churned\":25,\"retRate\":97.42},{\"snap\":\"2026-03-31\",\"agency\":\"Top Tier Health\",\"total\":359,\"retained\":346,\"new\":12,\"winback\":1,\"churned\":6,\"retRate\":98.3},{\"snap\":\"2026-04-14\",\"agency\":\"AMC Care Group\",\"total\":730,\"retained\":723,\"new\":7,\"winback\":0,\"churned\":2,\"retRate\":99.72},{\"snap\":\"2026-04-14\",\"agency\":\"AllCare Mar\",\"total\":8392,\"retained\":8285,\"new\":78,\"winback\":29,\"churned\":72,\"retRate\":99.14},{\"snap\":\"2026-04-14\",\"agency\":\"Concep Care\",\"total\":5370,\"retained\":5330,\"new\":30,\"winback\":10,\"churned\":34,\"retRate\":99.37},{\"snap\":\"2026-04-14\",\"agency\":\"GW Ins Group\",\"total\":1658,\"retained\":1626,\"new\":29,\"winback\":3,\"churned\":14,\"retRate\":99.15},{\"snap\":\"2026-04-14\",\"agency\":\"Gandhi, Manish\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"agency\":\"JPM Solutions\",\"total\":195,\"retained\":189,\"new\":6,\"winback\":0,\"churned\":2,\"retRate\":98.95},{\"snap\":\"2026-04-14\",\"agency\":\"KMRA Group\",\"total\":1137,\"retained\":1114,\"new\":20,\"winback\":3,\"churned\":10,\"retRate\":99.11},{\"snap\":\"2026-04-14\",\"agency\":\"Martell Multi\",\"total\":1041,\"retained\":1033,\"new\":7,\"winback\":1,\"churned\":5,\"retRate\":99.52},{\"snap\":\"2026-04-14\",\"agency\":\"NextGen Health\",\"total\":4,\"retained\":4,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"agency\":\"Origin Insurance\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"agency\":\"Simarova Senior\",\"total\":1616,\"retained\":1595,\"new\":16,\"winback\":5,\"churned\":12,\"retRate\":99.25},{\"snap\":\"2026-04-14\",\"agency\":\"TCS & Associates\",\"total\":977,\"retained\":967,\"new\":8,\"winback\":2,\"churned\":5,\"retRate\":99.49},{\"snap\":\"2026-04-14\",\"agency\":\"Top Tier Health\",\"total\":359,\"retained\":359,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"agency\":\"AMC Care Group\",\"total\":730,\"retained\":729,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":99.86},{\"snap\":\"2026-04-21\",\"agency\":\"AllCare Mar\",\"total\":8412,\"retained\":8373,\"new\":33,\"winback\":6,\"churned\":19,\"retRate\":99.77},{\"snap\":\"2026-04-21\",\"agency\":\"Concep Care\",\"total\":5389,\"retained\":5362,\"new\":24,\"winback\":3,\"churned\":8,\"retRate\":99.85},{\"snap\":\"2026-04-21\",\"agency\":\"GW Ins Group\",\"total\":1664,\"retained\":1653,\"new\":9,\"winback\":2,\"churned\":5,\"retRate\":99.7},{\"snap\":\"2026-04-21\",\"agency\":\"Gandhi, Manish\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"agency\":\"JPM Solutions\",\"total\":203,\"retained\":194,\"new\":9,\"winback\":0,\"churned\":1,\"retRate\":99.49},{\"snap\":\"2026-04-21\",\"agency\":\"KMRA Group\",\"total\":1142,\"retained\":1137,\"new\":4,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"agency\":\"Martell Multi\",\"total\":1042,\"retained\":1039,\"new\":3,\"winback\":0,\"churned\":2,\"retRate\":99.81},{\"snap\":\"2026-04-21\",\"agency\":\"NextGen Health\",\"total\":4,\"retained\":4,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"agency\":\"Origin Insurance\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"agency\":\"Simarova Senior\",\"total\":1623,\"retained\":1613,\"new\":10,\"winback\":0,\"churned\":3,\"retRate\":99.81},{\"snap\":\"2026-04-21\",\"agency\":\"TCS & Associates\",\"total\":973,\"retained\":973,\"new\":0,\"winback\":0,\"churned\":4,\"retRate\":99.59},{\"snap\":\"2026-04-21\",\"agency\":\"Top Tier Health\",\"total\":361,\"retained\":359,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"agency\":\"AMC Care Group\",\"total\":735,\"retained\":729,\"new\":6,\"winback\":0,\"churned\":1,\"retRate\":99.86},{\"snap\":\"2026-04-28\",\"agency\":\"AllCare Mar\",\"total\":8444,\"retained\":8383,\"new\":58,\"winback\":3,\"churned\":29,\"retRate\":99.66},{\"snap\":\"2026-04-28\",\"agency\":\"Concep Care\",\"total\":5411,\"retained\":5378,\"new\":32,\"winback\":1,\"churned\":11,\"retRate\":99.8},{\"snap\":\"2026-04-28\",\"agency\":\"GW Ins Group\",\"total\":1672,\"retained\":1659,\"new\":11,\"winback\":2,\"churned\":5,\"retRate\":99.7},{\"snap\":\"2026-04-28\",\"agency\":\"Gandhi, Manish\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"agency\":\"JPM Solutions\",\"total\":213,\"retained\":202,\"new\":9,\"winback\":2,\"churned\":1,\"retRate\":99.51},{\"snap\":\"2026-04-28\",\"agency\":\"KMRA Group\",\"total\":1150,\"retained\":1135,\"new\":14,\"winback\":1,\"churned\":7,\"retRate\":99.39},{\"snap\":\"2026-04-28\",\"agency\":\"Martell Multi\",\"total\":1053,\"retained\":1040,\"new\":13,\"winback\":0,\"churned\":2,\"retRate\":99.81},{\"snap\":\"2026-04-28\",\"agency\":\"NextGen Health\",\"total\":4,\"retained\":4,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"agency\":\"Origin Insurance\",\"total\":5,\"retained\":5,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"agency\":\"Simarova Senior\",\"total\":1620,\"retained\":1617,\"new\":3,\"winback\":0,\"churned\":6,\"retRate\":99.63},{\"snap\":\"2026-04-28\",\"agency\":\"TCS & Associates\",\"total\":973,\"retained\":968,\"new\":3,\"winback\":2,\"churned\":5,\"retRate\":99.49},{\"snap\":\"2026-04-28\",\"agency\":\"Top Tier Health\",\"total\":363,\"retained\":361,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":100.0}],\"byState\":[{\"snap\":\"2024-04-21\",\"state\":\"CA\",\"total\":12,\"retained\":0,\"new\":12,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"CO\",\"total\":6,\"retained\":0,\"new\":6,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"CT\",\"total\":39,\"retained\":0,\"new\":39,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"FL\",\"total\":194,\"retained\":0,\"new\":194,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"GA\",\"total\":9,\"retained\":0,\"new\":9,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"MD\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"NC\",\"total\":294,\"retained\":0,\"new\":294,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"NJ\",\"total\":4600,\"retained\":0,\"new\":4600,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"NY\",\"total\":37,\"retained\":0,\"new\":37,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"PA\",\"total\":123,\"retained\":0,\"new\":123,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"RI\",\"total\":2,\"retained\":0,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"SC\",\"total\":33,\"retained\":0,\"new\":33,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"TX\",\"total\":506,\"retained\":0,\"new\":506,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-04-21\",\"state\":\"VA\",\"total\":26,\"retained\":0,\"new\":26,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-05-28\",\"state\":\"CA\",\"total\":17,\"retained\":12,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-05-28\",\"state\":\"CO\",\"total\":7,\"retained\":6,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-05-28\",\"state\":\"CT\",\"total\":38,\"retained\":37,\"new\":1,\"winback\":0,\"churned\":2,\"retRate\":94.87},{\"snap\":\"2024-05-28\",\"state\":\"FL\",\"total\":231,\"retained\":186,\"new\":45,\"winback\":0,\"churned\":8,\"retRate\":95.88},{\"snap\":\"2024-05-28\",\"state\":\"GA\",\"total\":10,\"retained\":9,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-05-28\",\"state\":\"NC\",\"total\":173,\"retained\":158,\"new\":15,\"winback\":0,\"churned\":136,\"retRate\":53.74},{\"snap\":\"2024-05-28\",\"state\":\"NJ\",\"total\":4769,\"retained\":4521,\"new\":248,\"winback\":0,\"churned\":79,\"retRate\":98.28},{\"snap\":\"2024-05-28\",\"state\":\"NY\",\"total\":36,\"retained\":33,\"new\":3,\"winback\":0,\"churned\":4,\"retRate\":89.19},{\"snap\":\"2024-05-28\",\"state\":\"PA\",\"total\":122,\"retained\":117,\"new\":5,\"winback\":0,\"churned\":6,\"retRate\":95.12},{\"snap\":\"2024-05-28\",\"state\":\"RI\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-05-28\",\"state\":\"SC\",\"total\":33,\"retained\":33,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-05-28\",\"state\":\"TX\",\"total\":552,\"retained\":491,\"new\":61,\"winback\":0,\"churned\":15,\"retRate\":97.04},{\"snap\":\"2024-05-28\",\"state\":\"VA\",\"total\":24,\"retained\":23,\"new\":1,\"winback\":0,\"churned\":3,\"retRate\":88.46},{\"snap\":\"2024-06-28\",\"state\":\"CA\",\"total\":30,\"retained\":17,\"new\":13,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"state\":\"CO\",\"total\":7,\"retained\":7,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"state\":\"CT\",\"total\":37,\"retained\":35,\"new\":2,\"winback\":0,\"churned\":3,\"retRate\":92.11},{\"snap\":\"2024-06-28\",\"state\":\"FL\",\"total\":260,\"retained\":224,\"new\":34,\"winback\":2,\"churned\":7,\"retRate\":96.97},{\"snap\":\"2024-06-28\",\"state\":\"GA\",\"total\":10,\"retained\":10,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"state\":\"NC\",\"total\":321,\"retained\":173,\"new\":18,\"winback\":130,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"state\":\"NJ\",\"total\":4879,\"retained\":4695,\"new\":177,\"winback\":7,\"churned\":74,\"retRate\":98.45},{\"snap\":\"2024-06-28\",\"state\":\"NY\",\"total\":41,\"retained\":34,\"new\":3,\"winback\":4,\"churned\":2,\"retRate\":94.44},{\"snap\":\"2024-06-28\",\"state\":\"PA\",\"total\":131,\"retained\":119,\"new\":12,\"winback\":0,\"churned\":3,\"retRate\":97.54},{\"snap\":\"2024-06-28\",\"state\":\"RI\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"state\":\"SC\",\"total\":33,\"retained\":33,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-06-28\",\"state\":\"TX\",\"total\":582,\"retained\":523,\"new\":58,\"winback\":1,\"churned\":29,\"retRate\":94.75},{\"snap\":\"2024-06-28\",\"state\":\"VA\",\"total\":26,\"retained\":24,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-07-31\",\"state\":\"CA\",\"total\":34,\"retained\":28,\"new\":6,\"winback\":0,\"churned\":2,\"retRate\":93.33},{\"snap\":\"2024-07-31\",\"state\":\"CO\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":85.71},{\"snap\":\"2024-07-31\",\"state\":\"CT\",\"total\":37,\"retained\":35,\"new\":2,\"winback\":0,\"churned\":2,\"retRate\":94.59},{\"snap\":\"2024-07-31\",\"state\":\"FL\",\"total\":279,\"retained\":245,\"new\":34,\"winback\":0,\"churned\":15,\"retRate\":94.23},{\"snap\":\"2024-07-31\",\"state\":\"GA\",\"total\":9,\"retained\":9,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":90.0},{\"snap\":\"2024-07-31\",\"state\":\"NC\",\"total\":334,\"retained\":316,\"new\":18,\"winback\":0,\"churned\":5,\"retRate\":98.44},{\"snap\":\"2024-07-31\",\"state\":\"NJ\",\"total\":4997,\"retained\":4785,\"new\":206,\"winback\":6,\"churned\":94,\"retRate\":98.07},{\"snap\":\"2024-07-31\",\"state\":\"NY\",\"total\":41,\"retained\":38,\"new\":3,\"winback\":0,\"churned\":3,\"retRate\":92.68},{\"snap\":\"2024-07-31\",\"state\":\"PA\",\"total\":132,\"retained\":128,\"new\":4,\"winback\":0,\"churned\":3,\"retRate\":97.71},{\"snap\":\"2024-07-31\",\"state\":\"RI\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-07-31\",\"state\":\"SC\",\"total\":31,\"retained\":30,\"new\":1,\"winback\":0,\"churned\":3,\"retRate\":90.91},{\"snap\":\"2024-07-31\",\"state\":\"TX\",\"total\":668,\"retained\":569,\"new\":99,\"winback\":0,\"churned\":13,\"retRate\":97.77},{\"snap\":\"2024-07-31\",\"state\":\"VA\",\"total\":28,\"retained\":26,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"state\":\"CA\",\"total\":42,\"retained\":34,\"new\":7,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"state\":\"CO\",\"total\":7,\"retained\":6,\"new\":0,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"state\":\"CT\",\"total\":40,\"retained\":35,\"new\":5,\"winback\":0,\"churned\":2,\"retRate\":94.59},{\"snap\":\"2024-08-30\",\"state\":\"FL\",\"total\":290,\"retained\":272,\"new\":18,\"winback\":0,\"churned\":7,\"retRate\":97.49},{\"snap\":\"2024-08-30\",\"state\":\"GA\",\"total\":10,\"retained\":9,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"state\":\"MI\",\"total\":3,\"retained\":0,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-08-30\",\"state\":\"NC\",\"total\":375,\"retained\":330,\"new\":42,\"winback\":3,\"churned\":4,\"retRate\":98.8},{\"snap\":\"2024-08-30\",\"state\":\"NJ\",\"total\":5091,\"retained\":4921,\"new\":150,\"winback\":20,\"churned\":76,\"retRate\":98.48},{\"snap\":\"2024-08-30\",\"state\":\"NY\",\"total\":47,\"retained\":40,\"new\":7,\"winback\":0,\"churned\":1,\"retRate\":97.56},{\"snap\":\"2024-08-30\",\"state\":\"PA\",\"total\":133,\"retained\":127,\"new\":6,\"winback\":0,\"churned\":5,\"retRate\":96.21},{\"snap\":\"2024-08-30\",\"state\":\"PR\",\"total\":2,\"retained\":0,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-08-30\",\"state\":\"RI\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-08-30\",\"state\":\"SC\",\"total\":30,\"retained\":30,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":96.77},{\"snap\":\"2024-08-30\",\"state\":\"TX\",\"total\":733,\"retained\":649,\"new\":82,\"winback\":2,\"churned\":19,\"retRate\":97.16},{\"snap\":\"2024-08-30\",\"state\":\"VA\",\"total\":36,\"retained\":25,\"new\":11,\"winback\":0,\"churned\":3,\"retRate\":89.29},{\"snap\":\"2024-09-30\",\"state\":\"AZ\",\"total\":2,\"retained\":0,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-09-30\",\"state\":\"CA\",\"total\":51,\"retained\":41,\"new\":10,\"winback\":0,\"churned\":1,\"retRate\":97.62},{\"snap\":\"2024-09-30\",\"state\":\"CO\",\"total\":8,\"retained\":7,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"state\":\"CT\",\"total\":53,\"retained\":39,\"new\":14,\"winback\":0,\"churned\":1,\"retRate\":97.5},{\"snap\":\"2024-09-30\",\"state\":\"FL\",\"total\":312,\"retained\":285,\"new\":27,\"winback\":0,\"churned\":5,\"retRate\":98.28},{\"snap\":\"2024-09-30\",\"state\":\"GA\",\"total\":9,\"retained\":9,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":90.0},{\"snap\":\"2024-09-30\",\"state\":\"MI\",\"total\":7,\"retained\":3,\"new\":4,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"state\":\"NC\",\"total\":388,\"retained\":363,\"new\":24,\"winback\":1,\"churned\":12,\"retRate\":96.8},{\"snap\":\"2024-09-30\",\"state\":\"NJ\",\"total\":5181,\"retained\":5001,\"new\":169,\"winback\":11,\"churned\":90,\"retRate\":98.23},{\"snap\":\"2024-09-30\",\"state\":\"NY\",\"total\":48,\"retained\":47,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"state\":\"PA\",\"total\":143,\"retained\":127,\"new\":15,\"winback\":1,\"churned\":6,\"retRate\":95.49},{\"snap\":\"2024-09-30\",\"state\":\"PR\",\"total\":1,\"retained\":1,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":50.0},{\"snap\":\"2024-09-30\",\"state\":\"RI\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-09-30\",\"state\":\"SC\",\"total\":40,\"retained\":29,\"new\":10,\"winback\":1,\"churned\":1,\"retRate\":96.67},{\"snap\":\"2024-09-30\",\"state\":\"TX\",\"total\":794,\"retained\":701,\"new\":90,\"winback\":3,\"churned\":32,\"retRate\":95.63},{\"snap\":\"2024-09-30\",\"state\":\"VA\",\"total\":44,\"retained\":35,\"new\":6,\"winback\":3,\"churned\":1,\"retRate\":97.22},{\"snap\":\"2024-10-28\",\"state\":\"AZ\",\"total\":7,\"retained\":1,\"new\":6,\"winback\":0,\"churned\":1,\"retRate\":50.0},{\"snap\":\"2024-10-28\",\"state\":\"CA\",\"total\":61,\"retained\":49,\"new\":12,\"winback\":0,\"churned\":2,\"retRate\":96.08},{\"snap\":\"2024-10-28\",\"state\":\"CO\",\"total\":8,\"retained\":8,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"state\":\"CT\",\"total\":58,\"retained\":50,\"new\":8,\"winback\":0,\"churned\":3,\"retRate\":94.34},{\"snap\":\"2024-10-28\",\"state\":\"DE\",\"total\":5,\"retained\":0,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-10-28\",\"state\":\"FL\",\"total\":414,\"retained\":293,\"new\":120,\"winback\":1,\"churned\":19,\"retRate\":93.91},{\"snap\":\"2024-10-28\",\"state\":\"GA\",\"total\":12,\"retained\":9,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"state\":\"MI\",\"total\":15,\"retained\":7,\"new\":8,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"state\":\"NC\",\"total\":428,\"retained\":371,\"new\":53,\"winback\":4,\"churned\":17,\"retRate\":95.62},{\"snap\":\"2024-10-28\",\"state\":\"NJ\",\"total\":5343,\"retained\":5045,\"new\":291,\"winback\":7,\"churned\":136,\"retRate\":97.38},{\"snap\":\"2024-10-28\",\"state\":\"NY\",\"total\":71,\"retained\":45,\"new\":26,\"winback\":0,\"churned\":3,\"retRate\":93.75},{\"snap\":\"2024-10-28\",\"state\":\"PA\",\"total\":211,\"retained\":138,\"new\":72,\"winback\":1,\"churned\":5,\"retRate\":96.5},{\"snap\":\"2024-10-28\",\"state\":\"PR\",\"total\":2,\"retained\":1,\"new\":0,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"state\":\"RI\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-10-28\",\"state\":\"SC\",\"total\":41,\"retained\":38,\"new\":2,\"winback\":1,\"churned\":2,\"retRate\":95.0},{\"snap\":\"2024-10-28\",\"state\":\"TX\",\"total\":885,\"retained\":752,\"new\":131,\"winback\":2,\"churned\":42,\"retRate\":94.71},{\"snap\":\"2024-10-28\",\"state\":\"VA\",\"total\":55,\"retained\":40,\"new\":15,\"winback\":0,\"churned\":4,\"retRate\":90.91},{\"snap\":\"2024-11-26\",\"state\":\"AZ\",\"total\":21,\"retained\":7,\"new\":13,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"state\":\"CA\",\"total\":80,\"retained\":51,\"new\":27,\"winback\":2,\"churned\":10,\"retRate\":83.61},{\"snap\":\"2024-11-26\",\"state\":\"CO\",\"total\":9,\"retained\":8,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"state\":\"CT\",\"total\":81,\"retained\":56,\"new\":25,\"winback\":0,\"churned\":2,\"retRate\":96.55},{\"snap\":\"2024-11-26\",\"state\":\"DE\",\"total\":12,\"retained\":5,\"new\":7,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"state\":\"FL\",\"total\":953,\"retained\":389,\"new\":554,\"winback\":10,\"churned\":25,\"retRate\":93.96},{\"snap\":\"2024-11-26\",\"state\":\"GA\",\"total\":15,\"retained\":9,\"new\":6,\"winback\":0,\"churned\":3,\"retRate\":75.0},{\"snap\":\"2024-11-26\",\"state\":\"MI\",\"total\":14,\"retained\":14,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":93.33},{\"snap\":\"2024-11-26\",\"state\":\"NC\",\"total\":593,\"retained\":403,\"new\":187,\"winback\":3,\"churned\":25,\"retRate\":94.16},{\"snap\":\"2024-11-26\",\"state\":\"NJ\",\"total\":5589,\"retained\":5212,\"new\":361,\"winback\":16,\"churned\":131,\"retRate\":97.55},{\"snap\":\"2024-11-26\",\"state\":\"NY\",\"total\":148,\"retained\":71,\"new\":77,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"state\":\"PA\",\"total\":518,\"retained\":199,\"new\":314,\"winback\":5,\"churned\":12,\"retRate\":94.31},{\"snap\":\"2024-11-26\",\"state\":\"PR\",\"total\":3,\"retained\":2,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"state\":\"RI\",\"total\":9,\"retained\":2,\"new\":7,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-11-26\",\"state\":\"SC\",\"total\":44,\"retained\":39,\"new\":5,\"winback\":0,\"churned\":2,\"retRate\":95.12},{\"snap\":\"2024-11-26\",\"state\":\"TX\",\"total\":1119,\"retained\":831,\"new\":273,\"winback\":15,\"churned\":54,\"retRate\":93.9},{\"snap\":\"2024-11-26\",\"state\":\"VA\",\"total\":125,\"retained\":54,\"new\":71,\"winback\":0,\"churned\":1,\"retRate\":98.18},{\"snap\":\"2024-12-23\",\"state\":\"AZ\",\"total\":49,\"retained\":21,\"new\":28,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"state\":\"CA\",\"total\":108,\"retained\":71,\"new\":32,\"winback\":5,\"churned\":9,\"retRate\":88.75},{\"snap\":\"2024-12-23\",\"state\":\"CO\",\"total\":11,\"retained\":9,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"state\":\"CT\",\"total\":102,\"retained\":77,\"new\":25,\"winback\":0,\"churned\":4,\"retRate\":95.06},{\"snap\":\"2024-12-23\",\"state\":\"DE\",\"total\":13,\"retained\":12,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"state\":\"FL\",\"total\":1091,\"retained\":912,\"new\":174,\"winback\":5,\"churned\":41,\"retRate\":95.7},{\"snap\":\"2024-12-23\",\"state\":\"GA\",\"total\":14,\"retained\":12,\"new\":2,\"winback\":0,\"churned\":3,\"retRate\":80.0},{\"snap\":\"2024-12-23\",\"state\":\"MA\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-12-23\",\"state\":\"MI\",\"total\":13,\"retained\":13,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":92.86},{\"snap\":\"2024-12-23\",\"state\":\"MO\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2024-12-23\",\"state\":\"NC\",\"total\":662,\"retained\":574,\"new\":85,\"winback\":3,\"churned\":19,\"retRate\":96.8},{\"snap\":\"2024-12-23\",\"state\":\"NJ\",\"total\":5751,\"retained\":5422,\"new\":315,\"winback\":14,\"churned\":167,\"retRate\":97.01},{\"snap\":\"2024-12-23\",\"state\":\"NY\",\"total\":228,\"retained\":143,\"new\":85,\"winback\":0,\"churned\":5,\"retRate\":96.62},{\"snap\":\"2024-12-23\",\"state\":\"PA\",\"total\":570,\"retained\":498,\"new\":70,\"winback\":2,\"churned\":20,\"retRate\":96.14},{\"snap\":\"2024-12-23\",\"state\":\"PR\",\"total\":3,\"retained\":2,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":66.67},{\"snap\":\"2024-12-23\",\"state\":\"RI\",\"total\":14,\"retained\":9,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2024-12-23\",\"state\":\"SC\",\"total\":44,\"retained\":43,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":97.73},{\"snap\":\"2024-12-23\",\"state\":\"TX\",\"total\":1171,\"retained\":1067,\"new\":99,\"winback\":5,\"churned\":52,\"retRate\":95.35},{\"snap\":\"2024-12-23\",\"state\":\"VA\",\"total\":149,\"retained\":119,\"new\":30,\"winback\":0,\"churned\":6,\"retRate\":95.2},{\"snap\":\"2025-01-30\",\"state\":\"AZ\",\"total\":62,\"retained\":46,\"new\":16,\"winback\":0,\"churned\":3,\"retRate\":93.88},{\"snap\":\"2025-01-30\",\"state\":\"CA\",\"total\":86,\"retained\":85,\"new\":1,\"winback\":0,\"churned\":23,\"retRate\":78.7},{\"snap\":\"2025-01-30\",\"state\":\"CO\",\"total\":11,\"retained\":11,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-01-30\",\"state\":\"CT\",\"total\":109,\"retained\":98,\"new\":11,\"winback\":0,\"churned\":4,\"retRate\":96.08},{\"snap\":\"2025-01-30\",\"state\":\"DE\",\"total\":13,\"retained\":13,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-01-30\",\"state\":\"FL\",\"total\":1088,\"retained\":1047,\"new\":39,\"winback\":2,\"churned\":44,\"retRate\":95.97},{\"snap\":\"2025-01-30\",\"state\":\"GA\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":2,\"retRate\":85.71},{\"snap\":\"2025-01-30\",\"state\":\"MI\",\"total\":15,\"retained\":12,\"new\":2,\"winback\":1,\"churned\":1,\"retRate\":92.31},{\"snap\":\"2025-01-30\",\"state\":\"NC\",\"total\":668,\"retained\":645,\"new\":19,\"winback\":4,\"churned\":17,\"retRate\":97.43},{\"snap\":\"2025-01-30\",\"state\":\"NJ\",\"total\":5638,\"retained\":5491,\"new\":134,\"winback\":13,\"churned\":260,\"retRate\":95.48},{\"snap\":\"2025-01-30\",\"state\":\"NY\",\"total\":262,\"retained\":216,\"new\":46,\"winback\":0,\"churned\":12,\"retRate\":94.74},{\"snap\":\"2025-01-30\",\"state\":\"PA\",\"total\":609,\"retained\":552,\"new\":54,\"winback\":3,\"churned\":18,\"retRate\":96.84},{\"snap\":\"2025-01-30\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":66.67},{\"snap\":\"2025-01-30\",\"state\":\"RI\",\"total\":17,\"retained\":14,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-01-30\",\"state\":\"SC\",\"total\":42,\"retained\":41,\"new\":1,\"winback\":0,\"churned\":3,\"retRate\":93.18},{\"snap\":\"2025-01-30\",\"state\":\"TX\",\"total\":1195,\"retained\":1126,\"new\":67,\"winback\":2,\"churned\":45,\"retRate\":96.16},{\"snap\":\"2025-01-30\",\"state\":\"VA\",\"total\":165,\"retained\":144,\"new\":21,\"winback\":0,\"churned\":5,\"retRate\":96.64},{\"snap\":\"2025-02-25\",\"state\":\"AZ\",\"total\":78,\"retained\":61,\"new\":17,\"winback\":0,\"churned\":1,\"retRate\":98.39},{\"snap\":\"2025-02-25\",\"state\":\"CA\",\"total\":77,\"retained\":75,\"new\":1,\"winback\":1,\"churned\":11,\"retRate\":87.21},{\"snap\":\"2025-02-25\",\"state\":\"CO\",\"total\":11,\"retained\":10,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":90.91},{\"snap\":\"2025-02-25\",\"state\":\"CT\",\"total\":105,\"retained\":104,\"new\":1,\"winback\":0,\"churned\":5,\"retRate\":95.41},{\"snap\":\"2025-02-25\",\"state\":\"DE\",\"total\":14,\"retained\":13,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-02-25\",\"state\":\"FL\",\"total\":1194,\"retained\":1067,\"new\":126,\"winback\":1,\"churned\":21,\"retRate\":98.07},{\"snap\":\"2025-02-25\",\"state\":\"GA\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-02-25\",\"state\":\"MI\",\"total\":18,\"retained\":11,\"new\":7,\"winback\":0,\"churned\":4,\"retRate\":73.33},{\"snap\":\"2025-02-25\",\"state\":\"NC\",\"total\":694,\"retained\":656,\"new\":37,\"winback\":1,\"churned\":12,\"retRate\":98.2},{\"snap\":\"2025-02-25\",\"state\":\"NJ\",\"total\":5769,\"retained\":5501,\"new\":262,\"winback\":6,\"churned\":137,\"retRate\":97.57},{\"snap\":\"2025-02-25\",\"state\":\"NY\",\"total\":295,\"retained\":259,\"new\":36,\"winback\":0,\"churned\":3,\"retRate\":98.85},{\"snap\":\"2025-02-25\",\"state\":\"PA\",\"total\":673,\"retained\":593,\"new\":77,\"winback\":3,\"churned\":16,\"retRate\":97.37},{\"snap\":\"2025-02-25\",\"state\":\"PR\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":2,\"retRate\":0.0},{\"snap\":\"2025-02-25\",\"state\":\"RI\",\"total\":17,\"retained\":17,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-02-25\",\"state\":\"SC\",\"total\":39,\"retained\":38,\"new\":1,\"winback\":0,\"churned\":4,\"retRate\":90.48},{\"snap\":\"2025-02-25\",\"state\":\"TX\",\"total\":1258,\"retained\":1167,\"new\":83,\"winback\":8,\"churned\":28,\"retRate\":97.66},{\"snap\":\"2025-02-25\",\"state\":\"VA\",\"total\":162,\"retained\":157,\"new\":4,\"winback\":1,\"churned\":8,\"retRate\":95.15},{\"snap\":\"2025-03-31\",\"state\":\"AZ\",\"total\":88,\"retained\":76,\"new\":12,\"winback\":0,\"churned\":2,\"retRate\":97.44},{\"snap\":\"2025-03-31\",\"state\":\"CA\",\"total\":77,\"retained\":76,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":98.7},{\"snap\":\"2025-03-31\",\"state\":\"CO\",\"total\":16,\"retained\":11,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-03-31\",\"state\":\"CT\",\"total\":105,\"retained\":103,\"new\":2,\"winback\":0,\"churned\":2,\"retRate\":98.1},{\"snap\":\"2025-03-31\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":2,\"retRate\":85.71},{\"snap\":\"2025-03-31\",\"state\":\"FL\",\"total\":1385,\"retained\":1162,\"new\":221,\"winback\":2,\"churned\":32,\"retRate\":97.32},{\"snap\":\"2025-03-31\",\"state\":\"GA\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-03-31\",\"state\":\"MI\",\"total\":30,\"retained\":17,\"new\":10,\"winback\":3,\"churned\":1,\"retRate\":94.44},{\"snap\":\"2025-03-31\",\"state\":\"NC\",\"total\":790,\"retained\":682,\"new\":107,\"winback\":1,\"churned\":12,\"retRate\":98.27},{\"snap\":\"2025-03-31\",\"state\":\"NJ\",\"total\":6047,\"retained\":5648,\"new\":383,\"winback\":16,\"churned\":121,\"retRate\":97.9},{\"snap\":\"2025-03-31\",\"state\":\"NY\",\"total\":301,\"retained\":291,\"new\":9,\"winback\":1,\"churned\":4,\"retRate\":98.64},{\"snap\":\"2025-03-31\",\"state\":\"PA\",\"total\":808,\"retained\":658,\"new\":147,\"winback\":3,\"churned\":15,\"retRate\":97.77},{\"snap\":\"2025-03-31\",\"state\":\"RI\",\"total\":17,\"retained\":17,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-03-31\",\"state\":\"SC\",\"total\":40,\"retained\":38,\"new\":2,\"winback\":0,\"churned\":1,\"retRate\":97.44},{\"snap\":\"2025-03-31\",\"state\":\"TX\",\"total\":1381,\"retained\":1226,\"new\":153,\"winback\":2,\"churned\":32,\"retRate\":97.46},{\"snap\":\"2025-03-31\",\"state\":\"VA\",\"total\":154,\"retained\":120,\"new\":31,\"winback\":3,\"churned\":42,\"retRate\":74.07},{\"snap\":\"2025-04-29\",\"state\":\"AZ\",\"total\":92,\"retained\":83,\"new\":9,\"winback\":0,\"churned\":5,\"retRate\":94.32},{\"snap\":\"2025-04-29\",\"state\":\"CA\",\"total\":75,\"retained\":71,\"new\":3,\"winback\":1,\"churned\":6,\"retRate\":92.21},{\"snap\":\"2025-04-29\",\"state\":\"CO\",\"total\":32,\"retained\":16,\"new\":16,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-04-29\",\"state\":\"CT\",\"total\":101,\"retained\":100,\"new\":1,\"winback\":0,\"churned\":5,\"retRate\":95.24},{\"snap\":\"2025-04-29\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-04-29\",\"state\":\"FL\",\"total\":1612,\"retained\":1328,\"new\":278,\"winback\":6,\"churned\":57,\"retRate\":95.88},{\"snap\":\"2025-04-29\",\"state\":\"GA\",\"total\":17,\"retained\":12,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-04-29\",\"state\":\"MI\",\"total\":39,\"retained\":29,\"new\":10,\"winback\":0,\"churned\":1,\"retRate\":96.67},{\"snap\":\"2025-04-29\",\"state\":\"NC\",\"total\":810,\"retained\":758,\"new\":51,\"winback\":1,\"churned\":32,\"retRate\":95.95},{\"snap\":\"2025-04-29\",\"state\":\"NJ\",\"total\":5991,\"retained\":5792,\"new\":172,\"winback\":27,\"churned\":255,\"retRate\":95.78},{\"snap\":\"2025-04-29\",\"state\":\"NY\",\"total\":296,\"retained\":288,\"new\":8,\"winback\":0,\"churned\":13,\"retRate\":95.68},{\"snap\":\"2025-04-29\",\"state\":\"PA\",\"total\":926,\"retained\":782,\"new\":139,\"winback\":5,\"churned\":26,\"retRate\":96.78},{\"snap\":\"2025-04-29\",\"state\":\"PR\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-04-29\",\"state\":\"RI\",\"total\":17,\"retained\":17,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-04-29\",\"state\":\"SC\",\"total\":41,\"retained\":38,\"new\":2,\"winback\":1,\"churned\":2,\"retRate\":95.0},{\"snap\":\"2025-04-29\",\"state\":\"TX\",\"total\":1528,\"retained\":1315,\"new\":211,\"winback\":2,\"churned\":66,\"retRate\":95.22},{\"snap\":\"2025-04-29\",\"state\":\"VA\",\"total\":200,\"retained\":150,\"new\":26,\"winback\":24,\"churned\":4,\"retRate\":97.4},{\"snap\":\"2025-05-30\",\"state\":\"AZ\",\"total\":97,\"retained\":87,\"new\":9,\"winback\":1,\"churned\":5,\"retRate\":94.57},{\"snap\":\"2025-05-30\",\"state\":\"CA\",\"total\":78,\"retained\":73,\"new\":1,\"winback\":4,\"churned\":2,\"retRate\":97.33},{\"snap\":\"2025-05-30\",\"state\":\"CO\",\"total\":44,\"retained\":32,\"new\":12,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"state\":\"CT\",\"total\":101,\"retained\":99,\"new\":1,\"winback\":1,\"churned\":2,\"retRate\":98.02},{\"snap\":\"2025-05-30\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"state\":\"FL\",\"total\":1941,\"retained\":1579,\"new\":349,\"winback\":13,\"churned\":33,\"retRate\":97.95},{\"snap\":\"2025-05-30\",\"state\":\"GA\",\"total\":24,\"retained\":17,\"new\":7,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"state\":\"MI\",\"total\":39,\"retained\":38,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":97.44},{\"snap\":\"2025-05-30\",\"state\":\"NC\",\"total\":889,\"retained\":792,\"new\":91,\"winback\":6,\"churned\":18,\"retRate\":97.78},{\"snap\":\"2025-05-30\",\"state\":\"NJ\",\"total\":6031,\"retained\":5841,\"new\":120,\"winback\":70,\"churned\":150,\"retRate\":97.5},{\"snap\":\"2025-05-30\",\"state\":\"NY\",\"total\":312,\"retained\":293,\"new\":16,\"winback\":3,\"churned\":3,\"retRate\":98.99},{\"snap\":\"2025-05-30\",\"state\":\"PA\",\"total\":1003,\"retained\":909,\"new\":88,\"winback\":6,\"churned\":17,\"retRate\":98.16},{\"snap\":\"2025-05-30\",\"state\":\"PR\",\"total\":1,\"retained\":0,\"new\":0,\"winback\":1,\"churned\":1,\"retRate\":0.0},{\"snap\":\"2025-05-30\",\"state\":\"RI\",\"total\":17,\"retained\":17,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"state\":\"SC\",\"total\":42,\"retained\":41,\"new\":0,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-05-30\",\"state\":\"TX\",\"total\":1752,\"retained\":1494,\"new\":241,\"winback\":17,\"churned\":34,\"retRate\":97.77},{\"snap\":\"2025-05-30\",\"state\":\"VA\",\"total\":234,\"retained\":197,\"new\":28,\"winback\":9,\"churned\":3,\"retRate\":98.5},{\"snap\":\"2025-06-30\",\"state\":\"AZ\",\"total\":109,\"retained\":93,\"new\":15,\"winback\":1,\"churned\":4,\"retRate\":95.88},{\"snap\":\"2025-06-30\",\"state\":\"CA\",\"total\":77,\"retained\":75,\"new\":2,\"winback\":0,\"churned\":3,\"retRate\":96.15},{\"snap\":\"2025-06-30\",\"state\":\"CO\",\"total\":43,\"retained\":42,\"new\":1,\"winback\":0,\"churned\":2,\"retRate\":95.45},{\"snap\":\"2025-06-30\",\"state\":\"CT\",\"total\":105,\"retained\":101,\"new\":3,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"state\":\"FL\",\"total\":2404,\"retained\":1888,\"new\":497,\"winback\":19,\"churned\":53,\"retRate\":97.27},{\"snap\":\"2025-06-30\",\"state\":\"GA\",\"total\":36,\"retained\":24,\"new\":12,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"state\":\"MD\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-06-30\",\"state\":\"MI\",\"total\":43,\"retained\":37,\"new\":5,\"winback\":1,\"churned\":2,\"retRate\":94.87},{\"snap\":\"2025-06-30\",\"state\":\"NC\",\"total\":968,\"retained\":873,\"new\":86,\"winback\":9,\"churned\":16,\"retRate\":98.2},{\"snap\":\"2025-06-30\",\"state\":\"NJ\",\"total\":6104,\"retained\":5868,\"new\":164,\"winback\":72,\"churned\":163,\"retRate\":97.3},{\"snap\":\"2025-06-30\",\"state\":\"NY\",\"total\":324,\"retained\":302,\"new\":20,\"winback\":2,\"churned\":10,\"retRate\":96.79},{\"snap\":\"2025-06-30\",\"state\":\"PA\",\"total\":1098,\"retained\":981,\"new\":106,\"winback\":11,\"churned\":22,\"retRate\":97.81},{\"snap\":\"2025-06-30\",\"state\":\"PR\",\"total\":2,\"retained\":1,\"new\":0,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"state\":\"RI\",\"total\":18,\"retained\":17,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"state\":\"SC\",\"total\":48,\"retained\":42,\"new\":6,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-06-30\",\"state\":\"TX\",\"total\":1961,\"retained\":1704,\"new\":242,\"winback\":15,\"churned\":48,\"retRate\":97.26},{\"snap\":\"2025-06-30\",\"state\":\"VA\",\"total\":259,\"retained\":227,\"new\":31,\"winback\":1,\"churned\":7,\"retRate\":97.01},{\"snap\":\"2025-07-31\",\"state\":\"AL\",\"total\":27,\"retained\":0,\"new\":27,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-07-31\",\"state\":\"AZ\",\"total\":118,\"retained\":105,\"new\":10,\"winback\":3,\"churned\":4,\"retRate\":96.33},{\"snap\":\"2025-07-31\",\"state\":\"CA\",\"total\":80,\"retained\":75,\"new\":3,\"winback\":2,\"churned\":2,\"retRate\":97.4},{\"snap\":\"2025-07-31\",\"state\":\"CO\",\"total\":45,\"retained\":43,\"new\":1,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"CT\",\"total\":122,\"retained\":105,\"new\":14,\"winback\":3,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"FL\",\"total\":2683,\"retained\":2362,\"new\":286,\"winback\":35,\"churned\":42,\"retRate\":98.25},{\"snap\":\"2025-07-31\",\"state\":\"GA\",\"total\":48,\"retained\":36,\"new\":12,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"MI\",\"total\":54,\"retained\":43,\"new\":10,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"NC\",\"total\":1000,\"retained\":956,\"new\":25,\"winback\":19,\"churned\":12,\"retRate\":98.76},{\"snap\":\"2025-07-31\",\"state\":\"NJ\",\"total\":6326,\"retained\":6010,\"new\":154,\"winback\":162,\"churned\":94,\"retRate\":98.46},{\"snap\":\"2025-07-31\",\"state\":\"NY\",\"total\":350,\"retained\":316,\"new\":27,\"winback\":7,\"churned\":8,\"retRate\":97.53},{\"snap\":\"2025-07-31\",\"state\":\"PA\",\"total\":1123,\"retained\":1079,\"new\":24,\"winback\":20,\"churned\":19,\"retRate\":98.27},{\"snap\":\"2025-07-31\",\"state\":\"PR\",\"total\":3,\"retained\":2,\"new\":0,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"RI\",\"total\":19,\"retained\":18,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-07-31\",\"state\":\"SC\",\"total\":52,\"retained\":47,\"new\":4,\"winback\":1,\"churned\":1,\"retRate\":97.92},{\"snap\":\"2025-07-31\",\"state\":\"TX\",\"total\":2197,\"retained\":1928,\"new\":220,\"winback\":49,\"churned\":33,\"retRate\":98.32},{\"snap\":\"2025-07-31\",\"state\":\"VA\",\"total\":290,\"retained\":251,\"new\":32,\"winback\":7,\"churned\":8,\"retRate\":96.91},{\"snap\":\"2025-08-28\",\"state\":\"AL\",\"total\":48,\"retained\":27,\"new\":21,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"AZ\",\"total\":136,\"retained\":117,\"new\":17,\"winback\":2,\"churned\":1,\"retRate\":99.15},{\"snap\":\"2025-08-28\",\"state\":\"CA\",\"total\":83,\"retained\":80,\"new\":0,\"winback\":3,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"CO\",\"total\":62,\"retained\":45,\"new\":17,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"CT\",\"total\":152,\"retained\":122,\"new\":30,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"FL\",\"total\":2997,\"retained\":2654,\"new\":321,\"winback\":22,\"churned\":29,\"retRate\":98.92},{\"snap\":\"2025-08-28\",\"state\":\"GA\",\"total\":58,\"retained\":48,\"new\":10,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"MI\",\"total\":74,\"retained\":52,\"new\":22,\"winback\":0,\"churned\":2,\"retRate\":96.3},{\"snap\":\"2025-08-28\",\"state\":\"NC\",\"total\":1027,\"retained\":988,\"new\":34,\"winback\":5,\"churned\":12,\"retRate\":98.8},{\"snap\":\"2025-08-28\",\"state\":\"NJ\",\"total\":6441,\"retained\":6282,\"new\":128,\"winback\":31,\"churned\":44,\"retRate\":99.3},{\"snap\":\"2025-08-28\",\"state\":\"NY\",\"total\":382,\"retained\":347,\"new\":29,\"winback\":6,\"churned\":3,\"retRate\":99.14},{\"snap\":\"2025-08-28\",\"state\":\"PA\",\"total\":1201,\"retained\":1107,\"new\":82,\"winback\":12,\"churned\":16,\"retRate\":98.58},{\"snap\":\"2025-08-28\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":66.67},{\"snap\":\"2025-08-28\",\"state\":\"RI\",\"total\":43,\"retained\":19,\"new\":24,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-08-28\",\"state\":\"SC\",\"total\":51,\"retained\":51,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":98.08},{\"snap\":\"2025-08-28\",\"state\":\"TX\",\"total\":2398,\"retained\":2168,\"new\":222,\"winback\":8,\"churned\":29,\"retRate\":98.68},{\"snap\":\"2025-08-28\",\"state\":\"VA\",\"total\":307,\"retained\":280,\"new\":22,\"winback\":5,\"churned\":10,\"retRate\":96.55},{\"snap\":\"2025-09-30\",\"state\":\"AL\",\"total\":59,\"retained\":48,\"new\":11,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"AZ\",\"total\":148,\"retained\":136,\"new\":11,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"CA\",\"total\":81,\"retained\":78,\"new\":3,\"winback\":0,\"churned\":5,\"retRate\":93.98},{\"snap\":\"2025-09-30\",\"state\":\"CO\",\"total\":93,\"retained\":62,\"new\":31,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"CT\",\"total\":172,\"retained\":152,\"new\":20,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"DE\",\"total\":12,\"retained\":12,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"FL\",\"total\":3217,\"retained\":2964,\"new\":246,\"winback\":7,\"churned\":33,\"retRate\":98.9},{\"snap\":\"2025-09-30\",\"state\":\"GA\",\"total\":58,\"retained\":57,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":98.28},{\"snap\":\"2025-09-30\",\"state\":\"MI\",\"total\":77,\"retained\":74,\"new\":2,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"NC\",\"total\":1049,\"retained\":1018,\"new\":30,\"winback\":1,\"churned\":9,\"retRate\":99.12},{\"snap\":\"2025-09-30\",\"state\":\"NJ\",\"total\":6449,\"retained\":6343,\"new\":96,\"winback\":10,\"churned\":98,\"retRate\":98.48},{\"snap\":\"2025-09-30\",\"state\":\"NY\",\"total\":387,\"retained\":376,\"new\":11,\"winback\":0,\"churned\":6,\"retRate\":98.43},{\"snap\":\"2025-09-30\",\"state\":\"PA\",\"total\":1250,\"retained\":1190,\"new\":57,\"winback\":3,\"churned\":11,\"retRate\":99.08},{\"snap\":\"2025-09-30\",\"state\":\"PR\",\"total\":3,\"retained\":2,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"RI\",\"total\":82,\"retained\":43,\"new\":39,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"SC\",\"total\":51,\"retained\":51,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-09-30\",\"state\":\"TX\",\"total\":2539,\"retained\":2377,\"new\":158,\"winback\":4,\"churned\":21,\"retRate\":99.12},{\"snap\":\"2025-09-30\",\"state\":\"UT\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-09-30\",\"state\":\"VA\",\"total\":326,\"retained\":304,\"new\":21,\"winback\":1,\"churned\":3,\"retRate\":99.02},{\"snap\":\"2025-10-31\",\"state\":\"AL\",\"total\":111,\"retained\":58,\"new\":53,\"winback\":0,\"churned\":1,\"retRate\":98.31},{\"snap\":\"2025-10-31\",\"state\":\"AZ\",\"total\":158,\"retained\":144,\"new\":14,\"winback\":0,\"churned\":4,\"retRate\":97.3},{\"snap\":\"2025-10-31\",\"state\":\"CA\",\"total\":84,\"retained\":75,\"new\":9,\"winback\":0,\"churned\":6,\"retRate\":92.59},{\"snap\":\"2025-10-31\",\"state\":\"CO\",\"total\":200,\"retained\":92,\"new\":108,\"winback\":0,\"churned\":1,\"retRate\":98.92},{\"snap\":\"2025-10-31\",\"state\":\"CT\",\"total\":227,\"retained\":165,\"new\":62,\"winback\":0,\"churned\":7,\"retRate\":95.93},{\"snap\":\"2025-10-31\",\"state\":\"DE\",\"total\":148,\"retained\":12,\"new\":136,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-10-31\",\"state\":\"FL\",\"total\":3633,\"retained\":3134,\"new\":492,\"winback\":7,\"churned\":83,\"retRate\":97.42},{\"snap\":\"2025-10-31\",\"state\":\"GA\",\"total\":63,\"retained\":58,\"new\":5,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-10-31\",\"state\":\"KY\",\"total\":1,\"retained\":0,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-10-31\",\"state\":\"LA\",\"total\":10,\"retained\":0,\"new\":10,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-10-31\",\"state\":\"MI\",\"total\":105,\"retained\":74,\"new\":31,\"winback\":0,\"churned\":3,\"retRate\":96.1},{\"snap\":\"2025-10-31\",\"state\":\"NC\",\"total\":1097,\"retained\":1028,\"new\":65,\"winback\":4,\"churned\":21,\"retRate\":98.0},{\"snap\":\"2025-10-31\",\"state\":\"NJ\",\"total\":6519,\"retained\":6310,\"new\":196,\"winback\":13,\"churned\":139,\"retRate\":97.84},{\"snap\":\"2025-10-31\",\"state\":\"NY\",\"total\":434,\"retained\":377,\"new\":57,\"winback\":0,\"churned\":10,\"retRate\":97.42},{\"snap\":\"2025-10-31\",\"state\":\"OH\",\"total\":121,\"retained\":0,\"new\":121,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-10-31\",\"state\":\"PA\",\"total\":1778,\"retained\":1232,\"new\":542,\"winback\":4,\"churned\":18,\"retRate\":98.56},{\"snap\":\"2025-10-31\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":66.67},{\"snap\":\"2025-10-31\",\"state\":\"RI\",\"total\":169,\"retained\":82,\"new\":87,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-10-31\",\"state\":\"SC\",\"total\":53,\"retained\":48,\"new\":5,\"winback\":0,\"churned\":3,\"retRate\":94.12},{\"snap\":\"2025-10-31\",\"state\":\"TN\",\"total\":38,\"retained\":0,\"new\":38,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2025-10-31\",\"state\":\"TX\",\"total\":2839,\"retained\":2489,\"new\":348,\"winback\":2,\"churned\":50,\"retRate\":98.03},{\"snap\":\"2025-10-31\",\"state\":\"VA\",\"total\":338,\"retained\":307,\"new\":29,\"winback\":2,\"churned\":19,\"retRate\":94.17},{\"snap\":\"2025-11-25\",\"state\":\"AL\",\"total\":118,\"retained\":104,\"new\":14,\"winback\":0,\"churned\":7,\"retRate\":93.69},{\"snap\":\"2025-11-25\",\"state\":\"AZ\",\"total\":166,\"retained\":151,\"new\":15,\"winback\":0,\"churned\":7,\"retRate\":95.57},{\"snap\":\"2025-11-25\",\"state\":\"CA\",\"total\":83,\"retained\":79,\"new\":4,\"winback\":0,\"churned\":5,\"retRate\":94.05},{\"snap\":\"2025-11-25\",\"state\":\"CO\",\"total\":276,\"retained\":196,\"new\":80,\"winback\":0,\"churned\":4,\"retRate\":98.0},{\"snap\":\"2025-11-25\",\"state\":\"CT\",\"total\":284,\"retained\":219,\"new\":65,\"winback\":0,\"churned\":8,\"retRate\":96.48},{\"snap\":\"2025-11-25\",\"state\":\"DE\",\"total\":279,\"retained\":141,\"new\":138,\"winback\":0,\"churned\":7,\"retRate\":95.27},{\"snap\":\"2025-11-25\",\"state\":\"FL\",\"total\":3953,\"retained\":3510,\"new\":433,\"winback\":10,\"churned\":123,\"retRate\":96.61},{\"snap\":\"2025-11-25\",\"state\":\"GA\",\"total\":63,\"retained\":61,\"new\":2,\"winback\":0,\"churned\":2,\"retRate\":96.83},{\"snap\":\"2025-11-25\",\"state\":\"LA\",\"total\":32,\"retained\":9,\"new\":23,\"winback\":0,\"churned\":1,\"retRate\":90.0},{\"snap\":\"2025-11-25\",\"state\":\"MI\",\"total\":109,\"retained\":98,\"new\":11,\"winback\":0,\"churned\":7,\"retRate\":93.33},{\"snap\":\"2025-11-25\",\"state\":\"NC\",\"total\":1178,\"retained\":1073,\"new\":103,\"winback\":2,\"churned\":24,\"retRate\":97.81},{\"snap\":\"2025-11-25\",\"state\":\"NJ\",\"total\":6610,\"retained\":6324,\"new\":243,\"winback\":43,\"churned\":195,\"retRate\":97.01},{\"snap\":\"2025-11-25\",\"state\":\"NY\",\"total\":461,\"retained\":416,\"new\":43,\"winback\":2,\"churned\":18,\"retRate\":95.85},{\"snap\":\"2025-11-25\",\"state\":\"OH\",\"total\":279,\"retained\":116,\"new\":163,\"winback\":0,\"churned\":5,\"retRate\":95.87},{\"snap\":\"2025-11-25\",\"state\":\"PA\",\"total\":2260,\"retained\":1740,\"new\":514,\"winback\":6,\"churned\":38,\"retRate\":97.86},{\"snap\":\"2025-11-25\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-11-25\",\"state\":\"RI\",\"total\":273,\"retained\":167,\"new\":106,\"winback\":0,\"churned\":2,\"retRate\":98.82},{\"snap\":\"2025-11-25\",\"state\":\"SC\",\"total\":54,\"retained\":51,\"new\":3,\"winback\":0,\"churned\":2,\"retRate\":96.23},{\"snap\":\"2025-11-25\",\"state\":\"TN\",\"total\":42,\"retained\":35,\"new\":7,\"winback\":0,\"churned\":3,\"retRate\":92.11},{\"snap\":\"2025-11-25\",\"state\":\"TX\",\"total\":3098,\"retained\":2763,\"new\":331,\"winback\":4,\"churned\":76,\"retRate\":97.32},{\"snap\":\"2025-11-25\",\"state\":\"VA\",\"total\":400,\"retained\":328,\"new\":70,\"winback\":2,\"churned\":10,\"retRate\":97.04},{\"snap\":\"2025-12-31\",\"state\":\"AL\",\"total\":130,\"retained\":114,\"new\":15,\"winback\":1,\"churned\":4,\"retRate\":96.61},{\"snap\":\"2025-12-31\",\"state\":\"AZ\",\"total\":191,\"retained\":166,\"new\":22,\"winback\":3,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-12-31\",\"state\":\"CA\",\"total\":84,\"retained\":80,\"new\":3,\"winback\":1,\"churned\":3,\"retRate\":96.39},{\"snap\":\"2025-12-31\",\"state\":\"CO\",\"total\":348,\"retained\":271,\"new\":76,\"winback\":1,\"churned\":5,\"retRate\":98.19},{\"snap\":\"2025-12-31\",\"state\":\"CT\",\"total\":410,\"retained\":258,\"new\":151,\"winback\":1,\"churned\":26,\"retRate\":90.85},{\"snap\":\"2025-12-31\",\"state\":\"DE\",\"total\":332,\"retained\":263,\"new\":68,\"winback\":1,\"churned\":16,\"retRate\":94.27},{\"snap\":\"2025-12-31\",\"state\":\"FL\",\"total\":4255,\"retained\":3892,\"new\":334,\"winback\":29,\"churned\":61,\"retRate\":98.46},{\"snap\":\"2025-12-31\",\"state\":\"GA\",\"total\":63,\"retained\":62,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":98.41},{\"snap\":\"2025-12-31\",\"state\":\"LA\",\"total\":71,\"retained\":31,\"new\":40,\"winback\":0,\"churned\":1,\"retRate\":96.88},{\"snap\":\"2025-12-31\",\"state\":\"MI\",\"total\":107,\"retained\":102,\"new\":3,\"winback\":2,\"churned\":7,\"retRate\":93.58},{\"snap\":\"2025-12-31\",\"state\":\"NC\",\"total\":1299,\"retained\":1162,\"new\":134,\"winback\":3,\"churned\":16,\"retRate\":98.64},{\"snap\":\"2025-12-31\",\"state\":\"NJ\",\"total\":6817,\"retained\":6502,\"new\":292,\"winback\":23,\"churned\":108,\"retRate\":98.37},{\"snap\":\"2025-12-31\",\"state\":\"NY\",\"total\":483,\"retained\":453,\"new\":27,\"winback\":3,\"churned\":8,\"retRate\":98.26},{\"snap\":\"2025-12-31\",\"state\":\"OH\",\"total\":335,\"retained\":269,\"new\":65,\"winback\":1,\"churned\":10,\"retRate\":96.42},{\"snap\":\"2025-12-31\",\"state\":\"PA\",\"total\":2601,\"retained\":2214,\"new\":374,\"winback\":13,\"churned\":46,\"retRate\":97.96},{\"snap\":\"2025-12-31\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2025-12-31\",\"state\":\"RI\",\"total\":361,\"retained\":270,\"new\":90,\"winback\":1,\"churned\":3,\"retRate\":98.9},{\"snap\":\"2025-12-31\",\"state\":\"SC\",\"total\":54,\"retained\":53,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":98.15},{\"snap\":\"2025-12-31\",\"state\":\"TN\",\"total\":48,\"retained\":41,\"new\":7,\"winback\":0,\"churned\":1,\"retRate\":97.62},{\"snap\":\"2025-12-31\",\"state\":\"TX\",\"total\":3318,\"retained\":3055,\"new\":248,\"winback\":15,\"churned\":43,\"retRate\":98.61},{\"snap\":\"2025-12-31\",\"state\":\"VA\",\"total\":463,\"retained\":395,\"new\":64,\"winback\":4,\"churned\":5,\"retRate\":98.75},{\"snap\":\"2026-01-30\",\"state\":\"AL\",\"total\":138,\"retained\":127,\"new\":6,\"winback\":5,\"churned\":3,\"retRate\":97.69},{\"snap\":\"2026-01-30\",\"state\":\"AZ\",\"total\":184,\"retained\":183,\"new\":1,\"winback\":0,\"churned\":8,\"retRate\":95.81},{\"snap\":\"2026-01-30\",\"state\":\"CA\",\"total\":82,\"retained\":81,\"new\":1,\"winback\":0,\"churned\":3,\"retRate\":96.43},{\"snap\":\"2026-01-30\",\"state\":\"CO\",\"total\":405,\"retained\":344,\"new\":59,\"winback\":2,\"churned\":4,\"retRate\":98.85},{\"snap\":\"2026-01-30\",\"state\":\"CT\",\"total\":475,\"retained\":398,\"new\":74,\"winback\":3,\"churned\":12,\"retRate\":97.07},{\"snap\":\"2026-01-30\",\"state\":\"DE\",\"total\":328,\"retained\":324,\"new\":4,\"winback\":0,\"churned\":8,\"retRate\":97.59},{\"snap\":\"2026-01-30\",\"state\":\"FL\",\"total\":4310,\"retained\":4158,\"new\":141,\"winback\":11,\"churned\":97,\"retRate\":97.72},{\"snap\":\"2026-01-30\",\"state\":\"GA\",\"total\":62,\"retained\":62,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":98.41},{\"snap\":\"2026-01-30\",\"state\":\"LA\",\"total\":85,\"retained\":69,\"new\":15,\"winback\":1,\"churned\":2,\"retRate\":97.18},{\"snap\":\"2026-01-30\",\"state\":\"MI\",\"total\":113,\"retained\":107,\"new\":3,\"winback\":3,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-01-30\",\"state\":\"NC\",\"total\":1350,\"retained\":1277,\"new\":69,\"winback\":4,\"churned\":22,\"retRate\":98.31},{\"snap\":\"2026-01-30\",\"state\":\"NJ\",\"total\":6910,\"retained\":6693,\"new\":198,\"winback\":19,\"churned\":124,\"retRate\":98.18},{\"snap\":\"2026-01-30\",\"state\":\"NY\",\"total\":491,\"retained\":468,\"new\":23,\"winback\":0,\"churned\":15,\"retRate\":96.89},{\"snap\":\"2026-01-30\",\"state\":\"OH\",\"total\":386,\"retained\":330,\"new\":51,\"winback\":5,\"churned\":5,\"retRate\":98.51},{\"snap\":\"2026-01-30\",\"state\":\"PA\",\"total\":2765,\"retained\":2566,\"new\":185,\"winback\":14,\"churned\":35,\"retRate\":98.65},{\"snap\":\"2026-01-30\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-01-30\",\"state\":\"RI\",\"total\":384,\"retained\":357,\"new\":27,\"winback\":0,\"churned\":4,\"retRate\":98.89},{\"snap\":\"2026-01-30\",\"state\":\"SC\",\"total\":53,\"retained\":52,\"new\":1,\"winback\":0,\"churned\":2,\"retRate\":96.3},{\"snap\":\"2026-01-30\",\"state\":\"TN\",\"total\":49,\"retained\":47,\"new\":2,\"winback\":0,\"churned\":1,\"retRate\":97.92},{\"snap\":\"2026-01-30\",\"state\":\"TX\",\"total\":3404,\"retained\":3261,\"new\":128,\"winback\":15,\"churned\":57,\"retRate\":98.28},{\"snap\":\"2026-01-30\",\"state\":\"VA\",\"total\":501,\"retained\":452,\"new\":49,\"winback\":0,\"churned\":11,\"retRate\":97.62},{\"snap\":\"2026-01-30\",\"state\":\"WI\",\"total\":3,\"retained\":0,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":null},{\"snap\":\"2026-02-27\",\"state\":\"AL\",\"total\":133,\"retained\":129,\"new\":4,\"winback\":0,\"churned\":9,\"retRate\":93.48},{\"snap\":\"2026-02-27\",\"state\":\"AZ\",\"total\":154,\"retained\":153,\"new\":0,\"winback\":1,\"churned\":31,\"retRate\":83.15},{\"snap\":\"2026-02-27\",\"state\":\"CA\",\"total\":63,\"retained\":63,\"new\":0,\"winback\":0,\"churned\":19,\"retRate\":76.83},{\"snap\":\"2026-02-27\",\"state\":\"CO\",\"total\":410,\"retained\":393,\"new\":16,\"winback\":1,\"churned\":12,\"retRate\":97.04},{\"snap\":\"2026-02-27\",\"state\":\"CT\",\"total\":437,\"retained\":425,\"new\":10,\"winback\":2,\"churned\":50,\"retRate\":89.47},{\"snap\":\"2026-02-27\",\"state\":\"DE\",\"total\":315,\"retained\":315,\"new\":0,\"winback\":0,\"churned\":13,\"retRate\":96.04},{\"snap\":\"2026-02-27\",\"state\":\"FL\",\"total\":4172,\"retained\":4095,\"new\":67,\"winback\":10,\"churned\":215,\"retRate\":95.01},{\"snap\":\"2026-02-27\",\"state\":\"GA\",\"total\":59,\"retained\":57,\"new\":1,\"winback\":1,\"churned\":5,\"retRate\":91.94},{\"snap\":\"2026-02-27\",\"state\":\"LA\",\"total\":102,\"retained\":82,\"new\":20,\"winback\":0,\"churned\":3,\"retRate\":96.47},{\"snap\":\"2026-02-27\",\"state\":\"MI\",\"total\":97,\"retained\":95,\"new\":2,\"winback\":0,\"churned\":18,\"retRate\":84.07},{\"snap\":\"2026-02-27\",\"state\":\"NC\",\"total\":1293,\"retained\":1266,\"new\":22,\"winback\":5,\"churned\":84,\"retRate\":93.78},{\"snap\":\"2026-02-27\",\"state\":\"NJ\",\"total\":6439,\"retained\":6295,\"new\":126,\"winback\":18,\"churned\":615,\"retRate\":91.1},{\"snap\":\"2026-02-27\",\"state\":\"NY\",\"total\":403,\"retained\":391,\"new\":9,\"winback\":3,\"churned\":100,\"retRate\":79.63},{\"snap\":\"2026-02-27\",\"state\":\"OH\",\"total\":390,\"retained\":367,\"new\":21,\"winback\":2,\"churned\":19,\"retRate\":95.08},{\"snap\":\"2026-02-27\",\"state\":\"PA\",\"total\":2698,\"retained\":2596,\"new\":93,\"winback\":9,\"churned\":169,\"retRate\":93.89},{\"snap\":\"2026-02-27\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-02-27\",\"state\":\"RI\",\"total\":390,\"retained\":378,\"new\":11,\"winback\":1,\"churned\":6,\"retRate\":98.44},{\"snap\":\"2026-02-27\",\"state\":\"SC\",\"total\":50,\"retained\":45,\"new\":0,\"winback\":5,\"churned\":8,\"retRate\":84.91},{\"snap\":\"2026-02-27\",\"state\":\"TN\",\"total\":47,\"retained\":45,\"new\":1,\"winback\":1,\"churned\":4,\"retRate\":91.84},{\"snap\":\"2026-02-27\",\"state\":\"TX\",\"total\":3258,\"retained\":3188,\"new\":61,\"winback\":9,\"churned\":216,\"retRate\":93.65},{\"snap\":\"2026-02-27\",\"state\":\"VA\",\"total\":471,\"retained\":457,\"new\":14,\"winback\":0,\"churned\":44,\"retRate\":91.22},{\"snap\":\"2026-02-27\",\"state\":\"WI\",\"total\":6,\"retained\":3,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-03-31\",\"state\":\"AL\",\"total\":131,\"retained\":128,\"new\":3,\"winback\":0,\"churned\":5,\"retRate\":96.24},{\"snap\":\"2026-03-31\",\"state\":\"AZ\",\"total\":149,\"retained\":145,\"new\":3,\"winback\":1,\"churned\":9,\"retRate\":94.16},{\"snap\":\"2026-03-31\",\"state\":\"CA\",\"total\":57,\"retained\":56,\"new\":0,\"winback\":1,\"churned\":7,\"retRate\":88.89},{\"snap\":\"2026-03-31\",\"state\":\"CO\",\"total\":416,\"retained\":406,\"new\":10,\"winback\":0,\"churned\":4,\"retRate\":99.02},{\"snap\":\"2026-03-31\",\"state\":\"CT\",\"total\":440,\"retained\":426,\"new\":10,\"winback\":4,\"churned\":11,\"retRate\":97.48},{\"snap\":\"2026-03-31\",\"state\":\"DE\",\"total\":286,\"retained\":276,\"new\":6,\"winback\":4,\"churned\":39,\"retRate\":87.62},{\"snap\":\"2026-03-31\",\"state\":\"FL\",\"total\":4143,\"retained\":4072,\"new\":63,\"winback\":8,\"churned\":100,\"retRate\":97.6},{\"snap\":\"2026-03-31\",\"state\":\"GA\",\"total\":59,\"retained\":56,\"new\":3,\"winback\":0,\"churned\":3,\"retRate\":94.92},{\"snap\":\"2026-03-31\",\"state\":\"LA\",\"total\":102,\"retained\":95,\"new\":7,\"winback\":0,\"churned\":7,\"retRate\":93.14},{\"snap\":\"2026-03-31\",\"state\":\"MI\",\"total\":101,\"retained\":92,\"new\":9,\"winback\":0,\"churned\":5,\"retRate\":94.85},{\"snap\":\"2026-03-31\",\"state\":\"NC\",\"total\":1290,\"retained\":1250,\"new\":34,\"winback\":6,\"churned\":43,\"retRate\":96.67},{\"snap\":\"2026-03-31\",\"state\":\"NJ\",\"total\":6411,\"retained\":6213,\"new\":181,\"winback\":17,\"churned\":226,\"retRate\":96.49},{\"snap\":\"2026-03-31\",\"state\":\"NY\",\"total\":402,\"retained\":391,\"new\":8,\"winback\":3,\"churned\":12,\"retRate\":97.02},{\"snap\":\"2026-03-31\",\"state\":\"OH\",\"total\":379,\"retained\":376,\"new\":3,\"winback\":0,\"churned\":14,\"retRate\":96.41},{\"snap\":\"2026-03-31\",\"state\":\"PA\",\"total\":2719,\"retained\":2632,\"new\":80,\"winback\":7,\"churned\":66,\"retRate\":97.55},{\"snap\":\"2026-03-31\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-03-31\",\"state\":\"RI\",\"total\":407,\"retained\":386,\"new\":21,\"winback\":0,\"churned\":4,\"retRate\":98.97},{\"snap\":\"2026-03-31\",\"state\":\"SC\",\"total\":51,\"retained\":49,\"new\":2,\"winback\":0,\"churned\":1,\"retRate\":98.0},{\"snap\":\"2026-03-31\",\"state\":\"TN\",\"total\":40,\"retained\":40,\"new\":0,\"winback\":0,\"churned\":7,\"retRate\":85.11},{\"snap\":\"2026-03-31\",\"state\":\"TX\",\"total\":3258,\"retained\":3154,\"new\":91,\"winback\":13,\"churned\":104,\"retRate\":96.81},{\"snap\":\"2026-03-31\",\"state\":\"VA\",\"total\":496,\"retained\":456,\"new\":24,\"winback\":16,\"churned\":15,\"retRate\":96.82},{\"snap\":\"2026-03-31\",\"state\":\"WI\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"AL\",\"total\":130,\"retained\":130,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":99.24},{\"snap\":\"2026-04-14\",\"state\":\"AZ\",\"total\":149,\"retained\":149,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"CA\",\"total\":56,\"retained\":56,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":98.25},{\"snap\":\"2026-04-14\",\"state\":\"CO\",\"total\":417,\"retained\":415,\"new\":2,\"winback\":0,\"churned\":1,\"retRate\":99.76},{\"snap\":\"2026-04-14\",\"state\":\"CT\",\"total\":436,\"retained\":434,\"new\":2,\"winback\":0,\"churned\":6,\"retRate\":98.64},{\"snap\":\"2026-04-14\",\"state\":\"DE\",\"total\":284,\"retained\":284,\"new\":0,\"winback\":0,\"churned\":2,\"retRate\":99.3},{\"snap\":\"2026-04-14\",\"state\":\"FL\",\"total\":4148,\"retained\":4117,\"new\":19,\"winback\":12,\"churned\":26,\"retRate\":99.37},{\"snap\":\"2026-04-14\",\"state\":\"GA\",\"total\":59,\"retained\":59,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"LA\",\"total\":102,\"retained\":102,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"MI\",\"total\":107,\"retained\":100,\"new\":7,\"winback\":0,\"churned\":1,\"retRate\":99.01},{\"snap\":\"2026-04-14\",\"state\":\"NC\",\"total\":1294,\"retained\":1284,\"new\":9,\"winback\":1,\"churned\":6,\"retRate\":99.53},{\"snap\":\"2026-04-14\",\"state\":\"NJ\",\"total\":6470,\"retained\":6352,\"new\":113,\"winback\":5,\"churned\":59,\"retRate\":99.08},{\"snap\":\"2026-04-14\",\"state\":\"NY\",\"total\":401,\"retained\":398,\"new\":2,\"winback\":1,\"churned\":4,\"retRate\":99.0},{\"snap\":\"2026-04-14\",\"state\":\"OH\",\"total\":379,\"retained\":376,\"new\":1,\"winback\":2,\"churned\":3,\"retRate\":99.21},{\"snap\":\"2026-04-14\",\"state\":\"PA\",\"total\":2724,\"retained\":2702,\"new\":14,\"winback\":8,\"churned\":17,\"retRate\":99.37},{\"snap\":\"2026-04-14\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"RI\",\"total\":411,\"retained\":406,\"new\":5,\"winback\":0,\"churned\":1,\"retRate\":99.75},{\"snap\":\"2026-04-14\",\"state\":\"SC\",\"total\":52,\"retained\":51,\"new\":0,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"TN\",\"total\":40,\"retained\":40,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-14\",\"state\":\"TX\",\"total\":3283,\"retained\":3236,\"new\":21,\"winback\":26,\"churned\":22,\"retRate\":99.32},{\"snap\":\"2026-04-14\",\"state\":\"VA\",\"total\":497,\"retained\":492,\"new\":4,\"winback\":1,\"churned\":4,\"retRate\":99.19},{\"snap\":\"2026-04-14\",\"state\":\"WI\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"AL\",\"total\":130,\"retained\":130,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"AZ\",\"total\":149,\"retained\":149,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"CA\",\"total\":56,\"retained\":56,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"CO\",\"total\":420,\"retained\":417,\"new\":3,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"CT\",\"total\":435,\"retained\":434,\"new\":0,\"winback\":1,\"churned\":2,\"retRate\":99.54},{\"snap\":\"2026-04-21\",\"state\":\"DE\",\"total\":284,\"retained\":284,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"FL\",\"total\":4154,\"retained\":4139,\"new\":11,\"winback\":4,\"churned\":9,\"retRate\":99.78},{\"snap\":\"2026-04-21\",\"state\":\"GA\",\"total\":59,\"retained\":59,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"LA\",\"total\":102,\"retained\":102,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"MI\",\"total\":107,\"retained\":107,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"NC\",\"total\":1296,\"retained\":1294,\"new\":1,\"winback\":1,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"NJ\",\"total\":6519,\"retained\":6460,\"new\":52,\"winback\":7,\"churned\":10,\"retRate\":99.85},{\"snap\":\"2026-04-21\",\"state\":\"NY\",\"total\":402,\"retained\":401,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"OH\",\"total\":381,\"retained\":378,\"new\":2,\"winback\":1,\"churned\":1,\"retRate\":99.74},{\"snap\":\"2026-04-21\",\"state\":\"PA\",\"total\":2730,\"retained\":2721,\"new\":9,\"winback\":0,\"churned\":3,\"retRate\":99.89},{\"snap\":\"2026-04-21\",\"state\":\"PR\",\"total\":2,\"retained\":2,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"RI\",\"total\":415,\"retained\":411,\"new\":4,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"SC\",\"total\":50,\"retained\":50,\"new\":0,\"winback\":0,\"churned\":2,\"retRate\":96.15},{\"snap\":\"2026-04-21\",\"state\":\"TN\",\"total\":40,\"retained\":40,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-21\",\"state\":\"TX\",\"total\":3278,\"retained\":3272,\"new\":4,\"winback\":2,\"churned\":11,\"retRate\":99.66},{\"snap\":\"2026-04-21\",\"state\":\"VA\",\"total\":496,\"retained\":496,\"new\":0,\"winback\":0,\"churned\":1,\"retRate\":99.8},{\"snap\":\"2026-04-21\",\"state\":\"WI\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"AL\",\"total\":131,\"retained\":130,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"AZ\",\"total\":149,\"retained\":149,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"CA\",\"total\":56,\"retained\":56,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"CO\",\"total\":420,\"retained\":419,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":99.76},{\"snap\":\"2026-04-28\",\"state\":\"CT\",\"total\":439,\"retained\":435,\"new\":4,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"DE\",\"total\":284,\"retained\":283,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":99.65},{\"snap\":\"2026-04-28\",\"state\":\"FL\",\"total\":4154,\"retained\":4140,\"new\":10,\"winback\":4,\"churned\":14,\"retRate\":99.66},{\"snap\":\"2026-04-28\",\"state\":\"GA\",\"total\":59,\"retained\":59,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"LA\",\"total\":100,\"retained\":100,\"new\":0,\"winback\":0,\"churned\":2,\"retRate\":98.04},{\"snap\":\"2026-04-28\",\"state\":\"MI\",\"total\":108,\"retained\":107,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"NC\",\"total\":1297,\"retained\":1292,\"new\":4,\"winback\":1,\"churned\":4,\"retRate\":99.69},{\"snap\":\"2026-04-28\",\"state\":\"NJ\",\"total\":6598,\"retained\":6498,\"new\":94,\"winback\":6,\"churned\":21,\"retRate\":99.68},{\"snap\":\"2026-04-28\",\"state\":\"NY\",\"total\":402,\"retained\":401,\"new\":1,\"winback\":0,\"churned\":1,\"retRate\":99.75},{\"snap\":\"2026-04-28\",\"state\":\"OH\",\"total\":381,\"retained\":381,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"PA\",\"total\":2733,\"retained\":2723,\"new\":10,\"winback\":0,\"churned\":7,\"retRate\":99.74},{\"snap\":\"2026-04-28\",\"state\":\"PR\",\"total\":4,\"retained\":2,\"new\":2,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"RI\",\"total\":416,\"retained\":415,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"SC\",\"total\":50,\"retained\":50,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"TN\",\"total\":41,\"retained\":40,\"new\":1,\"winback\":0,\"churned\":0,\"retRate\":100.0},{\"snap\":\"2026-04-28\",\"state\":\"TX\",\"total\":3280,\"retained\":3263,\"new\":15,\"winback\":2,\"churned\":15,\"retRate\":99.54},{\"snap\":\"2026-04-28\",\"state\":\"VA\",\"total\":498,\"retained\":495,\"new\":3,\"winback\":0,\"churned\":1,\"retRate\":99.8},{\"snap\":\"2026-04-28\",\"state\":\"WI\",\"total\":6,\"retained\":6,\"new\":0,\"winback\":0,\"churned\":0,\"retRate\":100.0}],\"tenureGlobal\":{\"1-2 yr\":7899,\"3-6 mo\":6185,\"6-12 mo\":5105,\"0-3 mo\":2055,\"Unknown\":361,\"2-3 yr\":34,\"3+ yr\":9},\"tenureByAgency\":[{\"agency\":\"AMC Care Group\",\"bucket\":\"0-3 mo\",\"count\":64},{\"agency\":\"AMC Care Group\",\"bucket\":\"1-2 yr\",\"count\":103},{\"agency\":\"AMC Care Group\",\"bucket\":\"2-3 yr\",\"count\":2},{\"agency\":\"AMC Care Group\",\"bucket\":\"3-6 mo\",\"count\":310},{\"agency\":\"AMC Care Group\",\"bucket\":\"6-12 mo\",\"count\":242},{\"agency\":\"AMC Care Group\",\"bucket\":\"Unknown\",\"count\":14},{\"agency\":\"AllCare Mar\",\"bucket\":\"0-3 mo\",\"count\":605},{\"agency\":\"AllCare Mar\",\"bucket\":\"1-2 yr\",\"count\":3907},{\"agency\":\"AllCare Mar\",\"bucket\":\"2-3 yr\",\"count\":16},{\"agency\":\"AllCare Mar\",\"bucket\":\"3+ yr\",\"count\":9},{\"agency\":\"AllCare Mar\",\"bucket\":\"3-6 mo\",\"count\":1959},{\"agency\":\"AllCare Mar\",\"bucket\":\"6-12 mo\",\"count\":1806},{\"agency\":\"AllCare Mar\",\"bucket\":\"Unknown\",\"count\":142},{\"agency\":\"Concep Care\",\"bucket\":\"0-3 mo\",\"count\":334},{\"agency\":\"Concep Care\",\"bucket\":\"1-2 yr\",\"count\":2328},{\"agency\":\"Concep Care\",\"bucket\":\"2-3 yr\",\"count\":6},{\"agency\":\"Concep Care\",\"bucket\":\"3-6 mo\",\"count\":1481},{\"agency\":\"Concep Care\",\"bucket\":\"6-12 mo\",\"count\":1184},{\"agency\":\"Concep Care\",\"bucket\":\"Unknown\",\"count\":78},{\"agency\":\"GW Ins Group\",\"bucket\":\"0-3 mo\",\"count\":240},{\"agency\":\"GW Ins Group\",\"bucket\":\"1-2 yr\",\"count\":483},{\"agency\":\"GW Ins Group\",\"bucket\":\"2-3 yr\",\"count\":6},{\"agency\":\"GW Ins Group\",\"bucket\":\"3-6 mo\",\"count\":527},{\"agency\":\"GW Ins Group\",\"bucket\":\"6-12 mo\",\"count\":380},{\"agency\":\"GW Ins Group\",\"bucket\":\"Unknown\",\"count\":36},{\"agency\":\"Gandhi, Manish\",\"bucket\":\"1-2 yr\",\"count\":3},{\"agency\":\"Gandhi, Manish\",\"bucket\":\"2-3 yr\",\"count\":1},{\"agency\":\"Gandhi, Manish\",\"bucket\":\"3-6 mo\",\"count\":1},{\"agency\":\"JPM Solutions\",\"bucket\":\"0-3 mo\",\"count\":51},{\"agency\":\"JPM Solutions\",\"bucket\":\"1-2 yr\",\"count\":17},{\"agency\":\"JPM Solutions\",\"bucket\":\"3-6 mo\",\"count\":81},{\"agency\":\"JPM Solutions\",\"bucket\":\"6-12 mo\",\"count\":42},{\"agency\":\"JPM Solutions\",\"bucket\":\"Unknown\",\"count\":22},{\"agency\":\"KMRA Group\",\"bucket\":\"0-3 mo\",\"count\":175},{\"agency\":\"KMRA Group\",\"bucket\":\"1-2 yr\",\"count\":274},{\"agency\":\"KMRA Group\",\"bucket\":\"3-6 mo\",\"count\":450},{\"agency\":\"KMRA Group\",\"bucket\":\"6-12 mo\",\"count\":230},{\"agency\":\"KMRA Group\",\"bucket\":\"Unknown\",\"count\":21},{\"agency\":\"Martell Multi\",\"bucket\":\"0-3 mo\",\"count\":129},{\"agency\":\"Martell Multi\",\"bucket\":\"1-2 yr\",\"count\":260},{\"agency\":\"Martell Multi\",\"bucket\":\"2-3 yr\",\"count\":1},{\"agency\":\"Martell Multi\",\"bucket\":\"3-6 mo\",\"count\":420},{\"agency\":\"Martell Multi\",\"bucket\":\"6-12 mo\",\"count\":225},{\"agency\":\"Martell Multi\",\"bucket\":\"Unknown\",\"count\":18},{\"agency\":\"NextGen Health\",\"bucket\":\"0-3 mo\",\"count\":4},{\"agency\":\"Origin Insurance\",\"bucket\":\"1-2 yr\",\"count\":5},{\"agency\":\"Simarova Senior\",\"bucket\":\"0-3 mo\",\"count\":280},{\"agency\":\"Simarova Senior\",\"bucket\":\"1-2 yr\",\"count\":239},{\"agency\":\"Simarova Senior\",\"bucket\":\"2-3 yr\",\"count\":1},{\"agency\":\"Simarova Senior\",\"bucket\":\"3-6 mo\",\"count\":503},{\"agency\":\"Simarova Senior\",\"bucket\":\"6-12 mo\",\"count\":579},{\"agency\":\"Simarova Senior\",\"bucket\":\"Unknown\",\"count\":18},{\"agency\":\"TCS & Associates\",\"bucket\":\"0-3 mo\",\"count\":129},{\"agency\":\"TCS & Associates\",\"bucket\":\"1-2 yr\",\"count\":174},{\"agency\":\"TCS & Associates\",\"bucket\":\"3-6 mo\",\"count\":336},{\"agency\":\"TCS & Associates\",\"bucket\":\"6-12 mo\",\"count\":325},{\"agency\":\"TCS & Associates\",\"bucket\":\"Unknown\",\"count\":9},{\"agency\":\"Top Tier Health\",\"bucket\":\"0-3 mo\",\"count\":44},{\"agency\":\"Top Tier Health\",\"bucket\":\"1-2 yr\",\"count\":106},{\"agency\":\"Top Tier Health\",\"bucket\":\"2-3 yr\",\"count\":1},{\"agency\":\"Top Tier Health\",\"bucket\":\"3-6 mo\",\"count\":117},{\"agency\":\"Top Tier Health\",\"bucket\":\"6-12 mo\",\"count\":92},{\"agency\":\"Top Tier Health\",\"bucket\":\"Unknown\",\"count\":3}],\"tenureByState\":[{\"state\":\"AL\",\"bucket\":\"0-3 mo\",\"count\":11},{\"state\":\"AL\",\"bucket\":\"1-2 yr\",\"count\":28},{\"state\":\"AL\",\"bucket\":\"3-6 mo\",\"count\":42},{\"state\":\"AL\",\"bucket\":\"6-12 mo\",\"count\":49},{\"state\":\"AL\",\"bucket\":\"Unknown\",\"count\":1},{\"state\":\"AZ\",\"bucket\":\"0-3 mo\",\"count\":9},{\"state\":\"AZ\",\"bucket\":\"1-2 yr\",\"count\":56},{\"state\":\"AZ\",\"bucket\":\"2-3 yr\",\"count\":1},{\"state\":\"AZ\",\"bucket\":\"3-6 mo\",\"count\":40},{\"state\":\"AZ\",\"bucket\":\"6-12 mo\",\"count\":42},{\"state\":\"AZ\",\"bucket\":\"Unknown\",\"count\":1},{\"state\":\"CA\",\"bucket\":\"0-3 mo\",\"count\":4},{\"state\":\"CA\",\"bucket\":\"1-2 yr\",\"count\":35},{\"state\":\"CA\",\"bucket\":\"3-6 mo\",\"count\":5},{\"state\":\"CA\",\"bucket\":\"6-12 mo\",\"count\":12},{\"state\":\"CO\",\"bucket\":\"0-3 mo\",\"count\":80},{\"state\":\"CO\",\"bucket\":\"1-2 yr\",\"count\":47},{\"state\":\"CO\",\"bucket\":\"2-3 yr\",\"count\":1},{\"state\":\"CO\",\"bucket\":\"3-6 mo\",\"count\":208},{\"state\":\"CO\",\"bucket\":\"6-12 mo\",\"count\":80},{\"state\":\"CO\",\"bucket\":\"Unknown\",\"count\":4},{\"state\":\"CT\",\"bucket\":\"0-3 mo\",\"count\":79},{\"state\":\"CT\",\"bucket\":\"1-2 yr\",\"count\":47},{\"state\":\"CT\",\"bucket\":\"3-6 mo\",\"count\":235},{\"state\":\"CT\",\"bucket\":\"6-12 mo\",\"count\":70},{\"state\":\"CT\",\"bucket\":\"Unknown\",\"count\":8},{\"state\":\"DE\",\"bucket\":\"0-3 mo\",\"count\":21},{\"state\":\"DE\",\"bucket\":\"1-2 yr\",\"count\":42},{\"state\":\"DE\",\"bucket\":\"3-6 mo\",\"count\":194},{\"state\":\"DE\",\"bucket\":\"6-12 mo\",\"count\":26},{\"state\":\"DE\",\"bucket\":\"Unknown\",\"count\":1},{\"state\":\"FL\",\"bucket\":\"0-3 mo\",\"count\":254},{\"state\":\"FL\",\"bucket\":\"1-2 yr\",\"count\":1256},{\"state\":\"FL\",\"bucket\":\"2-3 yr\",\"count\":8},{\"state\":\"FL\",\"bucket\":\"3+ yr\",\"count\":1},{\"state\":\"FL\",\"bucket\":\"3-6 mo\",\"count\":1131},{\"state\":\"FL\",\"bucket\":\"6-12 mo\",\"count\":1465},{\"state\":\"FL\",\"bucket\":\"Unknown\",\"count\":39},{\"state\":\"GA\",\"bucket\":\"0-3 mo\",\"count\":5},{\"state\":\"GA\",\"bucket\":\"1-2 yr\",\"count\":12},{\"state\":\"GA\",\"bucket\":\"3-6 mo\",\"count\":9},{\"state\":\"GA\",\"bucket\":\"6-12 mo\",\"count\":33},{\"state\":\"LA\",\"bucket\":\"0-3 mo\",\"count\":38},{\"state\":\"LA\",\"bucket\":\"1-2 yr\",\"count\":1},{\"state\":\"LA\",\"bucket\":\"3-6 mo\",\"count\":60},{\"state\":\"LA\",\"bucket\":\"6-12 mo\",\"count\":1},{\"state\":\"MI\",\"bucket\":\"0-3 mo\",\"count\":17},{\"state\":\"MI\",\"bucket\":\"1-2 yr\",\"count\":21},{\"state\":\"MI\",\"bucket\":\"3-6 mo\",\"count\":27},{\"state\":\"MI\",\"bucket\":\"6-12 mo\",\"count\":38},{\"state\":\"MI\",\"bucket\":\"Unknown\",\"count\":5},{\"state\":\"NC\",\"bucket\":\"0-3 mo\",\"count\":131},{\"state\":\"NC\",\"bucket\":\"1-2 yr\",\"count\":555},{\"state\":\"NC\",\"bucket\":\"2-3 yr\",\"count\":1},{\"state\":\"NC\",\"bucket\":\"3-6 mo\",\"count\":314},{\"state\":\"NC\",\"bucket\":\"6-12 mo\",\"count\":279},{\"state\":\"NC\",\"bucket\":\"Unknown\",\"count\":17},{\"state\":\"NJ\",\"bucket\":\"0-3 mo\",\"count\":551},{\"state\":\"NJ\",\"bucket\":\"1-2 yr\",\"count\":3585},{\"state\":\"NJ\",\"bucket\":\"2-3 yr\",\"count\":14},{\"state\":\"NJ\",\"bucket\":\"3+ yr\",\"count\":7},{\"state\":\"NJ\",\"bucket\":\"3-6 mo\",\"count\":1087},{\"state\":\"NJ\",\"bucket\":\"6-12 mo\",\"count\":1137},{\"state\":\"NJ\",\"bucket\":\"Unknown\",\"count\":217},{\"state\":\"NY\",\"bucket\":\"0-3 mo\",\"count\":43},{\"state\":\"NY\",\"bucket\":\"1-2 yr\",\"count\":148},{\"state\":\"NY\",\"bucket\":\"2-3 yr\",\"count\":2},{\"state\":\"NY\",\"bucket\":\"3-6 mo\",\"count\":130},{\"state\":\"NY\",\"bucket\":\"6-12 mo\",\"count\":77},{\"state\":\"NY\",\"bucket\":\"Unknown\",\"count\":2},{\"state\":\"OH\",\"bucket\":\"0-3 mo\",\"count\":73},{\"state\":\"OH\",\"bucket\":\"1-2 yr\",\"count\":29},{\"state\":\"OH\",\"bucket\":\"3-6 mo\",\"count\":247},{\"state\":\"OH\",\"bucket\":\"6-12 mo\",\"count\":27},{\"state\":\"OH\",\"bucket\":\"Unknown\",\"count\":5},{\"state\":\"PA\",\"bucket\":\"0-3 mo\",\"count\":321},{\"state\":\"PA\",\"bucket\":\"1-2 yr\",\"count\":743},{\"state\":\"PA\",\"bucket\":\"3-6 mo\",\"count\":1138},{\"state\":\"PA\",\"bucket\":\"6-12 mo\",\"count\":510},{\"state\":\"PA\",\"bucket\":\"Unknown\",\"count\":21},{\"state\":\"PR\",\"bucket\":\"1-2 yr\",\"count\":2},{\"state\":\"PR\",\"bucket\":\"6-12 mo\",\"count\":2},{\"state\":\"RI\",\"bucket\":\"0-3 mo\",\"count\":54},{\"state\":\"RI\",\"bucket\":\"1-2 yr\",\"count\":46},{\"state\":\"RI\",\"bucket\":\"3-6 mo\",\"count\":243},{\"state\":\"RI\",\"bucket\":\"6-12 mo\",\"count\":65},{\"state\":\"RI\",\"bucket\":\"Unknown\",\"count\":8},{\"state\":\"SC\",\"bucket\":\"0-3 mo\",\"count\":7},{\"state\":\"SC\",\"bucket\":\"1-2 yr\",\"count\":21},{\"state\":\"SC\",\"bucket\":\"3-6 mo\",\"count\":9},{\"state\":\"SC\",\"bucket\":\"6-12 mo\",\"count\":12},{\"state\":\"SC\",\"bucket\":\"Unknown\",\"count\":1},{\"state\":\"TN\",\"bucket\":\"1-2 yr\",\"count\":10},{\"state\":\"TN\",\"bucket\":\"2-3 yr\",\"count\":2},{\"state\":\"TN\",\"bucket\":\"3-6 mo\",\"count\":15},{\"state\":\"TN\",\"bucket\":\"6-12 mo\",\"count\":14},{\"state\":\"TX\",\"bucket\":\"0-3 mo\",\"count\":270},{\"state\":\"TX\",\"bucket\":\"1-2 yr\",\"count\":1095},{\"state\":\"TX\",\"bucket\":\"2-3 yr\",\"count\":5},{\"state\":\"TX\",\"bucket\":\"3+ yr\",\"count\":1},{\"state\":\"TX\",\"bucket\":\"3-6 mo\",\"count\":861},{\"state\":\"TX\",\"bucket\":\"6-12 mo\",\"count\":1023},{\"state\":\"TX\",\"bucket\":\"Unknown\",\"count\":25},{\"state\":\"VA\",\"bucket\":\"0-3 mo\",\"count\":76},{\"state\":\"VA\",\"bucket\":\"1-2 yr\",\"count\":111},{\"state\":\"VA\",\"bucket\":\"3-6 mo\",\"count\":175},{\"state\":\"VA\",\"bucket\":\"6-12 mo\",\"count\":130},{\"state\":\"VA\",\"bucket\":\"Unknown\",\"count\":6},{\"state\":\"WI\",\"bucket\":\"0-3 mo\",\"count\":6}]}");

// ── FIPS → BOB members (real data from ACM_BOB_04-28-26.xlsx, all 776 counties) ──
const FIPS_BOB={
  "01003":{"m":5,"c":"Baldwin","s":"AL"},
  "01015":{"m":3,"c":"Calhoun","s":"AL"},
  "01025":{"m":4,"c":"Clarke","s":"AL"},
  "01043":{"m":4,"c":"Cullman","s":"AL"},
  "01045":{"m":4,"c":"Dale","s":"AL"},
  "01047":{"m":5,"c":"Dallas","s":"AL"},
  "01073":{"m":13,"c":"Jefferson","s":"AL"},
  "01089":{"m":7,"c":"Madison","s":"AL"},
  "01097":{"m":8,"c":"Mobile","s":"AL"},
  "01101":{"m":18,"c":"Montgomery","s":"AL"},
  "01117":{"m":6,"c":"Shelby","s":"AL"},
  "04003":{"m":2,"c":"Cochise","s":"AZ"},
  "04013":{"m":88,"c":"Maricopa","s":"AZ"},
  "04015":{"m":3,"c":"Mohave","s":"AZ"},
  "04019":{"m":33,"c":"Pima","s":"AZ"},
  "04021":{"m":17,"c":"Pinal","s":"AZ"},
  "04027":{"m":4,"c":"Yuma","s":"AZ"},
  "06031":{"m":4,"c":"Kings","s":"CA"},
  "06037":{"m":29,"c":"Los Angeles","s":"CA"},
  "06059":{"m":4,"c":"Orange","s":"CA"},
  "06065":{"m":5,"c":"Riverside","s":"CA"},
  "06073":{"m":3,"c":"San Diego","s":"CA"},
  "08001":{"m":28,"c":"Adams","s":"CO"},
  "08005":{"m":25,"c":"Arapahoe","s":"CO"},
  "08013":{"m":7,"c":"Boulder","s":"CO"},
  "08029":{"m":18,"c":"Delta","s":"CO"},
  "08031":{"m":24,"c":"Denver","s":"CO"},
  "08041":{"m":37,"c":"El Paso","s":"CO"},
  "08045":{"m":26,"c":"Garfield","s":"CO"},
  "08059":{"m":9,"c":"Jefferson","s":"CO"},
  "08069":{"m":21,"c":"Larimer","s":"CO"},
  "08077":{"m":67,"c":"Mesa","s":"CO"},
  "08085":{"m":19,"c":"Montrose","s":"CO"},
  "08101":{"m":28,"c":"Pueblo","s":"CO"},
  "08123":{"m":34,"c":"Weld","s":"CO"},
  "09001":{"m":176,"c":"Fairfield","s":"CT"},
  "09003":{"m":98,"c":"Hartford","s":"CT"},
  "09005":{"m":5,"c":"Litchfield","s":"CT"},
  "09007":{"m":3,"c":"Middlesex","s":"CT"},
  "09009":{"m":122,"c":"New Haven","s":"CT"},
  "09011":{"m":17,"c":"New London","s":"CT"},
  "09013":{"m":3,"c":"Tolland","s":"CT"},
  "09015":{"m":12,"c":"Windham","s":"CT"},
  "10001":{"m":59,"c":"Kent","s":"DE"},
  "10003":{"m":159,"c":"New Castle","s":"DE"},
  "10005":{"m":66,"c":"Sussex","s":"DE"},
  "12001":{"m":30,"c":"Alachua","s":"FL"},
  "12003":{"m":8,"c":"Baker","s":"FL"},
  "12005":{"m":4,"c":"Bay","s":"FL"},
  "12007":{"m":6,"c":"Bradford","s":"FL"},
  "12009":{"m":167,"c":"Brevard","s":"FL"},
  "12011":{"m":141,"c":"Broward","s":"FL"},
  "12013":{"m":1,"c":"Calhoun","s":"FL"},
  "12015":{"m":28,"c":"Charlotte","s":"FL"},
  "12017":{"m":24,"c":"Citrus","s":"FL"},
  "12019":{"m":53,"c":"Clay","s":"FL"},
  "12021":{"m":98,"c":"Collier","s":"FL"},
  "12023":{"m":16,"c":"Columbia","s":"FL"},
  "12027":{"m":4,"c":"De Soto","s":"FL"},
  "12029":{"m":2,"c":"Dixie","s":"FL"},
  "12031":{"m":232,"c":"Duval","s":"FL"},
  "12033":{"m":18,"c":"Escambia","s":"FL"},
  "12035":{"m":11,"c":"Flagler","s":"FL"},
  "12039":{"m":3,"c":"Gadsden","s":"FL"},
  "12041":{"m":2,"c":"Gilchrist","s":"FL"},
  "12043":{"m":6,"c":"Glades","s":"FL"},
  "12047":{"m":9,"c":"Hamilton","s":"FL"},
  "12049":{"m":6,"c":"Hardee","s":"FL"},
  "12051":{"m":26,"c":"Hendry","s":"FL"},
  "12053":{"m":73,"c":"Hernando","s":"FL"},
  "12055":{"m":55,"c":"Highlands","s":"FL"},
  "12057":{"m":347,"c":"Hillsborough","s":"FL"},
  "12059":{"m":2,"c":"Holmes","s":"FL"},
  "12061":{"m":31,"c":"Indian River","s":"FL"},
  "12063":{"m":7,"c":"Jackson","s":"FL"},
  "12065":{"m":2,"c":"Jefferson","s":"FL"},
  "12067":{"m":2,"c":"Lafayette","s":"FL"},
  "12069":{"m":127,"c":"Lake","s":"FL"},
  "12071":{"m":203,"c":"Lee","s":"FL"},
  "12073":{"m":27,"c":"Leon","s":"FL"},
  "12075":{"m":12,"c":"Levy","s":"FL"},
  "12077":{"m":1,"c":"Liberty","s":"FL"},
  "12079":{"m":5,"c":"Madison","s":"FL"},
  "12081":{"m":63,"c":"Manatee","s":"FL"},
  "12083":{"m":242,"c":"Marion","s":"FL"},
  "12085":{"m":5,"c":"Martin","s":"FL"},
  "12086":{"m":437,"c":"Miami-Dade","s":"FL"},
  "12089":{"m":13,"c":"Nassau","s":"FL"},
  "12091":{"m":11,"c":"Okaloosa","s":"FL"},
  "12093":{"m":19,"c":"Okeechobee","s":"FL"},
  "12095":{"m":336,"c":"Orange","s":"FL"},
  "12097":{"m":142,"c":"Osceola","s":"FL"},
  "12099":{"m":70,"c":"Palm Beach","s":"FL"},
  "12101":{"m":129,"c":"Pasco","s":"FL"},
  "12103":{"m":140,"c":"Pinellas","s":"FL"},
  "12105":{"m":257,"c":"Polk","s":"FL"},
  "12107":{"m":17,"c":"Putnam","s":"FL"},
  "12109":{"m":22,"c":"Saint Johns","s":"FL"},
  "12111":{"m":66,"c":"Saint Lucie","s":"FL"},
  "12113":{"m":2,"c":"Santa Rosa","s":"FL"},
  "12115":{"m":60,"c":"Sarasota","s":"FL"},
  "12117":{"m":112,"c":"Seminole","s":"FL"},
  "12119":{"m":22,"c":"Sumter","s":"FL"},
  "12121":{"m":18,"c":"Suwannee","s":"FL"},
  "12123":{"m":5,"c":"Taylor","s":"FL"},
  "12125":{"m":7,"c":"Union","s":"FL"},
  "12127":{"m":143,"c":"Volusia","s":"FL"},
  "12131":{"m":3,"c":"Walton","s":"FL"},
  "12133":{"m":4,"c":"Washington","s":"FL"},
  "13121":{"m":3,"c":"Fulton","s":"GA"},
  "13131":{"m":10,"c":"Grady","s":"GA"},
  "13135":{"m":12,"c":"Gwinnett","s":"GA"},
  "13313":{"m":3,"c":"Whitfield","s":"GA"},
  "22001":{"m":5,"c":"Acadia","s":"LA"},
  "22017":{"m":5,"c":"Caddo","s":"LA"},
  "22033":{"m":5,"c":"East Baton Rouge","s":"LA"},
  "22051":{"m":11,"c":"Jefferson","s":"LA"},
  "22055":{"m":10,"c":"Lafayette","s":"LA"},
  "22057":{"m":5,"c":"Lafourche","s":"LA"},
  "22071":{"m":13,"c":"Orleans","s":"LA"},
  "22109":{"m":7,"c":"Terrebonne","s":"LA"},
  "26025":{"m":4,"c":"Calhoun","s":"MI"},
  "26077":{"m":5,"c":"Kalamazoo","s":"MI"},
  "26081":{"m":18,"c":"Kent","s":"MI"},
  "26125":{"m":32,"c":"Oakland","s":"MI"},
  "26159":{"m":6,"c":"Van Buren","s":"MI"},
  "26163":{"m":31,"c":"Wayne","s":"MI"},
  "34001":{"m":106,"c":"Atlantic","s":"NJ"},
  "34003":{"m":559,"c":"Bergen","s":"NJ"},
  "34005":{"m":178,"c":"Burlington","s":"NJ"},
  "34007":{"m":272,"c":"Camden","s":"NJ"},
  "34009":{"m":11,"c":"Cape May","s":"NJ"},
  "34011":{"m":72,"c":"Cumberland","s":"NJ"},
  "34013":{"m":754,"c":"Essex","s":"NJ"},
  "34015":{"m":64,"c":"Gloucester","s":"NJ"},
  "34017":{"m":1477,"c":"Hudson","s":"NJ"},
  "34019":{"m":38,"c":"Hunterdon","s":"NJ"},
  "34021":{"m":196,"c":"Mercer","s":"NJ"},
  "34023":{"m":622,"c":"Middlesex","s":"NJ"},
  "34025":{"m":203,"c":"Monmouth","s":"NJ"},
  "34027":{"m":270,"c":"Morris","s":"NJ"},
  "34029":{"m":236,"c":"Ocean","s":"NJ"},
  "34031":{"m":453,"c":"Passaic","s":"NJ"},
  "34033":{"m":26,"c":"Salem","s":"NJ"},
  "34035":{"m":134,"c":"Somerset","s":"NJ"},
  "34037":{"m":69,"c":"Sussex","s":"NJ"},
  "34039":{"m":577,"c":"Union","s":"NJ"},
  "34041":{"m":78,"c":"Warren","s":"NJ"},
  "36005":{"m":59,"c":"Bronx","s":"NY"},
  "36013":{"m":6,"c":"Chautauqua","s":"NY"},
  "36027":{"m":5,"c":"Dutchess","s":"NY"},
  "36029":{"m":7,"c":"Erie","s":"NY"},
  "36039":{"m":6,"c":"Greene","s":"NY"},
  "36045":{"m":5,"c":"Jefferson","s":"NY"},
  "36047":{"m":54,"c":"Kings","s":"NY"},
  "36053":{"m":7,"c":"Madison","s":"NY"},
  "36061":{"m":43,"c":"New York","s":"NY"},
  "36065":{"m":7,"c":"Oneida","s":"NY"},
  "36067":{"m":5,"c":"Onondaga","s":"NY"},
  "36071":{"m":10,"c":"Orange","s":"NY"},
  "36081":{"m":34,"c":"Queens","s":"NY"},
  "36083":{"m":8,"c":"Rensselaer","s":"NY"},
  "36085":{"m":21,"c":"Richmond","s":"NY"},
  "36087":{"m":8,"c":"Rockland","s":"NY"},
  "36093":{"m":12,"c":"Schenectady","s":"NY"},
  "36101":{"m":7,"c":"Steuben","s":"NY"},
  "36113":{"m":8,"c":"Warren","s":"NY"},
  "36115":{"m":8,"c":"Washington","s":"NY"},
  "36119":{"m":35,"c":"Westchester","s":"NY"},
  "37001":{"m":60,"c":"Alamance","s":"NC"},
  "37003":{"m":6,"c":"Alexander","s":"NC"},
  "37005":{"m":2,"c":"Alleghany","s":"NC"},
  "37007":{"m":3,"c":"Anson","s":"NC"},
  "37009":{"m":2,"c":"Ashe","s":"NC"},
  "37013":{"m":3,"c":"Beaufort","s":"NC"},
  "37015":{"m":3,"c":"Bertie","s":"NC"},
  "37017":{"m":5,"c":"Bladen","s":"NC"},
  "37019":{"m":15,"c":"Brunswick","s":"NC"},
  "37021":{"m":12,"c":"Buncombe","s":"NC"},
  "37023":{"m":2,"c":"Burke","s":"NC"},
  "37025":{"m":27,"c":"Cabarrus","s":"NC"},
  "37027":{"m":7,"c":"Caldwell","s":"NC"},
  "37031":{"m":6,"c":"Carteret","s":"NC"},
  "37033":{"m":7,"c":"Caswell","s":"NC"},
  "37035":{"m":17,"c":"Catawba","s":"NC"},
  "37037":{"m":5,"c":"Chatham","s":"NC"},
  "37039":{"m":2,"c":"Cherokee","s":"NC"},
  "37041":{"m":1,"c":"Chowan","s":"NC"},
  "37043":{"m":2,"c":"Clay","s":"NC"},
  "37045":{"m":9,"c":"Cleveland","s":"NC"},
  "37047":{"m":2,"c":"Columbus","s":"NC"},
  "37049":{"m":8,"c":"Craven","s":"NC"},
  "37051":{"m":82,"c":"Cumberland","s":"NC"},
  "37057":{"m":22,"c":"Davidson","s":"NC"},
  "37059":{"m":3,"c":"Davie","s":"NC"},
  "37061":{"m":10,"c":"Duplin","s":"NC"},
  "37063":{"m":16,"c":"Durham","s":"NC"},
  "37065":{"m":2,"c":"Edgecombe","s":"NC"},
  "37067":{"m":69,"c":"Forsyth","s":"NC"},
  "37069":{"m":13,"c":"Franklin","s":"NC"},
  "37071":{"m":60,"c":"Gaston","s":"NC"},
  "37075":{"m":3,"c":"Graham","s":"NC"},
  "37077":{"m":1,"c":"Granville","s":"NC"},
  "37079":{"m":1,"c":"Greene","s":"NC"},
  "37081":{"m":61,"c":"Guilford","s":"NC"},
  "37083":{"m":5,"c":"Halifax","s":"NC"},
  "37085":{"m":22,"c":"Harnett","s":"NC"},
  "37087":{"m":2,"c":"Haywood","s":"NC"},
  "37089":{"m":35,"c":"Henderson","s":"NC"},
  "37091":{"m":1,"c":"Hertford","s":"NC"},
  "37093":{"m":14,"c":"Hoke","s":"NC"},
  "37097":{"m":18,"c":"Iredell","s":"NC"},
  "37101":{"m":54,"c":"Johnston","s":"NC"},
  "37103":{"m":3,"c":"Jones","s":"NC"},
  "37105":{"m":20,"c":"Lee","s":"NC"},
  "37107":{"m":3,"c":"Lenoir","s":"NC"},
  "37109":{"m":11,"c":"Lincoln","s":"NC"},
  "37111":{"m":3,"c":"Mcdowell","s":"NC"},
  "37113":{"m":3,"c":"Macon","s":"NC"},
  "37115":{"m":1,"c":"Madison","s":"NC"},
  "37117":{"m":1,"c":"Martin","s":"NC"},
  "37119":{"m":169,"c":"Mecklenburg","s":"NC"},
  "37121":{"m":2,"c":"Mitchell","s":"NC"},
  "37123":{"m":1,"c":"Montgomery","s":"NC"},
  "37125":{"m":7,"c":"Moore","s":"NC"},
  "37127":{"m":17,"c":"Nash","s":"NC"},
  "37129":{"m":2,"c":"New Hanover","s":"NC"},
  "37131":{"m":2,"c":"Northampton","s":"NC"},
  "37133":{"m":19,"c":"Onslow","s":"NC"},
  "37135":{"m":10,"c":"Orange","s":"NC"},
  "37139":{"m":4,"c":"Pasquotank","s":"NC"},
  "37141":{"m":5,"c":"Pender","s":"NC"},
  "37145":{"m":1,"c":"Person","s":"NC"},
  "37147":{"m":17,"c":"Pitt","s":"NC"},
  "37149":{"m":2,"c":"Polk","s":"NC"},
  "37151":{"m":33,"c":"Randolph","s":"NC"},
  "37153":{"m":1,"c":"Richmond","s":"NC"},
  "37155":{"m":9,"c":"Robeson","s":"NC"},
  "37157":{"m":4,"c":"Rockingham","s":"NC"},
  "37159":{"m":16,"c":"Rowan","s":"NC"},
  "37161":{"m":4,"c":"Rutherford","s":"NC"},
  "37163":{"m":10,"c":"Sampson","s":"NC"},
  "37165":{"m":1,"c":"Scotland","s":"NC"},
  "37167":{"m":8,"c":"Stanly","s":"NC"},
  "37169":{"m":2,"c":"Stokes","s":"NC"},
  "37171":{"m":9,"c":"Surry","s":"NC"},
  "37175":{"m":1,"c":"Transylvania","s":"NC"},
  "37179":{"m":17,"c":"Union","s":"NC"},
  "37183":{"m":113,"c":"Wake","s":"NC"},
  "37185":{"m":1,"c":"Warren","s":"NC"},
  "37189":{"m":1,"c":"Watauga","s":"NC"},
  "37191":{"m":22,"c":"Wayne","s":"NC"},
  "37193":{"m":8,"c":"Wilkes","s":"NC"},
  "37195":{"m":17,"c":"Wilson","s":"NC"},
  "37197":{"m":3,"c":"Yadkin","s":"NC"},
  "37199":{"m":10,"c":"Yancey","s":"NC"},
  "39007":{"m":25,"c":"Ashtabula","s":"OH"},
  "39017":{"m":15,"c":"Butler","s":"OH"},
  "39025":{"m":11,"c":"Clermont","s":"OH"},
  "39035":{"m":72,"c":"Cuyahoga","s":"OH"},
  "39049":{"m":28,"c":"Franklin","s":"OH"},
  "39087":{"m":17,"c":"Lawrence","s":"OH"},
  "39093":{"m":63,"c":"Lorain","s":"OH"},
  "39095":{"m":11,"c":"Lucas","s":"OH"},
  "39099":{"m":20,"c":"Mahoning","s":"OH"},
  "39153":{"m":15,"c":"Summit","s":"OH"},
  "39155":{"m":9,"c":"Trumbull","s":"OH"},
  "42001":{"m":3,"c":"Adams","s":"PA"},
  "42003":{"m":165,"c":"Allegheny","s":"PA"},
  "42005":{"m":27,"c":"Armstrong","s":"PA"},
  "42007":{"m":46,"c":"Beaver","s":"PA"},
  "42009":{"m":24,"c":"Bedford","s":"PA"},
  "42011":{"m":480,"c":"Berks","s":"PA"},
  "42013":{"m":22,"c":"Blair","s":"PA"},
  "42017":{"m":54,"c":"Bucks","s":"PA"},
  "42019":{"m":41,"c":"Butler","s":"PA"},
  "42021":{"m":34,"c":"Cambria","s":"PA"},
  "42025":{"m":2,"c":"Carbon","s":"PA"},
  "42029":{"m":82,"c":"Chester","s":"PA"},
  "42031":{"m":16,"c":"Clarion","s":"PA"},
  "42039":{"m":34,"c":"Crawford","s":"PA"},
  "42041":{"m":36,"c":"Cumberland","s":"PA"},
  "42043":{"m":73,"c":"Dauphin","s":"PA"},
  "42045":{"m":26,"c":"Delaware","s":"PA"},
  "42047":{"m":7,"c":"Elk","s":"PA"},
  "42049":{"m":119,"c":"Erie","s":"PA"},
  "42051":{"m":71,"c":"Fayette","s":"PA"},
  "42053":{"m":7,"c":"Forest","s":"PA"},
  "42059":{"m":41,"c":"Greene","s":"PA"},
  "42061":{"m":2,"c":"Huntingdon","s":"PA"},
  "42063":{"m":11,"c":"Indiana","s":"PA"},
  "42065":{"m":8,"c":"Jefferson","s":"PA"},
  "42069":{"m":72,"c":"Lackawanna","s":"PA"},
  "42071":{"m":212,"c":"Lancaster","s":"PA"},
  "42073":{"m":38,"c":"Lawrence","s":"PA"},
  "42075":{"m":34,"c":"Lebanon","s":"PA"},
  "42077":{"m":163,"c":"Lehigh","s":"PA"},
  "42079":{"m":139,"c":"Luzerne","s":"PA"},
  "42083":{"m":4,"c":"Mckean","s":"PA"},
  "42085":{"m":35,"c":"Mercer","s":"PA"},
  "42089":{"m":49,"c":"Monroe","s":"PA"},
  "42091":{"m":35,"c":"Montgomery","s":"PA"},
  "42095":{"m":26,"c":"Northampton","s":"PA"},
  "42099":{"m":2,"c":"Perry","s":"PA"},
  "42101":{"m":75,"c":"Philadelphia","s":"PA"},
  "42103":{"m":4,"c":"Pike","s":"PA"},
  "42107":{"m":8,"c":"Schuylkill","s":"PA"},
  "42111":{"m":28,"c":"Somerset","s":"PA"},
  "42115":{"m":3,"c":"Susquehanna","s":"PA"},
  "42117":{"m":4,"c":"Tioga","s":"PA"},
  "42121":{"m":54,"c":"Venango","s":"PA"},
  "42123":{"m":29,"c":"Warren","s":"PA"},
  "42125":{"m":57,"c":"Washington","s":"PA"},
  "42127":{"m":2,"c":"Wayne","s":"PA"},
  "42129":{"m":122,"c":"Westmoreland","s":"PA"},
  "42133":{"m":97,"c":"York","s":"PA"},
  "44001":{"m":7,"c":"Bristol","s":"RI"},
  "44003":{"m":42,"c":"Kent","s":"RI"},
  "44005":{"m":25,"c":"Newport","s":"RI"},
  "44007":{"m":313,"c":"Providence","s":"RI"},
  "44009":{"m":24,"c":"Washington","s":"RI"},
  "45013":{"m":12,"c":"Beaufort","s":"SC"},
  "45045":{"m":8,"c":"Greenville","s":"SC"},
  "45051":{"m":4,"c":"Horry","s":"SC"},
  "45057":{"m":3,"c":"Lancaster","s":"SC"},
  "47037":{"m":4,"c":"Davidson","s":"TN"},
  "47149":{"m":4,"c":"Rutherford","s":"TN"},
  "47157":{"m":3,"c":"Shelby","s":"TN"},
  "48003":{"m":5,"c":"Andrews","s":"TX"},
  "48005":{"m":13,"c":"Angelina","s":"TX"},
  "48007":{"m":6,"c":"Aransas","s":"TX"},
  "48013":{"m":13,"c":"Atascosa","s":"TX"},
  "48021":{"m":48,"c":"Bastrop","s":"TX"},
  "48027":{"m":27,"c":"Bell","s":"TX"},
  "48029":{"m":496,"c":"Bexar","s":"TX"},
  "48039":{"m":59,"c":"Brazoria","s":"TX"},
  "48041":{"m":8,"c":"Brazos","s":"TX"},
  "48047":{"m":5,"c":"Brooks","s":"TX"},
  "48053":{"m":9,"c":"Burnet","s":"TX"},
  "48055":{"m":13,"c":"Caldwell","s":"TX"},
  "48061":{"m":98,"c":"Cameron","s":"TX"},
  "48073":{"m":8,"c":"Cherokee","s":"TX"},
  "48085":{"m":19,"c":"Collin","s":"TX"},
  "48091":{"m":22,"c":"Comal","s":"TX"},
  "48113":{"m":111,"c":"Dallas","s":"TX"},
  "48121":{"m":11,"c":"Denton","s":"TX"},
  "48127":{"m":7,"c":"Dimmit","s":"TX"},
  "48135":{"m":26,"c":"Ector","s":"TX"},
  "48139":{"m":7,"c":"Ellis","s":"TX"},
  "48141":{"m":37,"c":"El Paso","s":"TX"},
  "48157":{"m":109,"c":"Fort Bend","s":"TX"},
  "48167":{"m":73,"c":"Galveston","s":"TX"},
  "48171":{"m":8,"c":"Gillespie","s":"TX"},
  "48177":{"m":17,"c":"Gonzales","s":"TX"},
  "48181":{"m":9,"c":"Grayson","s":"TX"},
  "48183":{"m":8,"c":"Gregg","s":"TX"},
  "48187":{"m":26,"c":"Guadalupe","s":"TX"},
  "48201":{"m":728,"c":"Harris","s":"TX"},
  "48203":{"m":7,"c":"Harrison","s":"TX"},
  "48209":{"m":42,"c":"Hays","s":"TX"},
  "48213":{"m":21,"c":"Henderson","s":"TX"},
  "48215":{"m":102,"c":"Hidalgo","s":"TX"},
  "48227":{"m":5,"c":"Howard","s":"TX"},
  "48245":{"m":5,"c":"Jefferson","s":"TX"},
  "48251":{"m":15,"c":"Johnson","s":"TX"},
  "48257":{"m":14,"c":"Kaufman","s":"TX"},
  "48259":{"m":7,"c":"Kendall","s":"TX"},
  "48273":{"m":6,"c":"Kleberg","s":"TX"},
  "48303":{"m":8,"c":"Lubbock","s":"TX"},
  "48309":{"m":11,"c":"Mclennan","s":"TX"},
  "48323":{"m":28,"c":"Maverick","s":"TX"},
  "48325":{"m":9,"c":"Medina","s":"TX"},
  "48329":{"m":29,"c":"Midland","s":"TX"},
  "48331":{"m":5,"c":"Milam","s":"TX"},
  "48339":{"m":51,"c":"Montgomery","s":"TX"},
  "48347":{"m":6,"c":"Nacogdoches","s":"TX"},
  "48355":{"m":29,"c":"Nueces","s":"TX"},
  "48409":{"m":17,"c":"San Patricio","s":"TX"},
  "48423":{"m":31,"c":"Smith","s":"TX"},
  "48427":{"m":79,"c":"Starr","s":"TX"},
  "48439":{"m":116,"c":"Tarrant","s":"TX"},
  "48453":{"m":189,"c":"Travis","s":"TX"},
  "48467":{"m":8,"c":"Van Zandt","s":"TX"},
  "48473":{"m":6,"c":"Waller","s":"TX"},
  "48479":{"m":108,"c":"Webb","s":"TX"},
  "48489":{"m":6,"c":"Willacy","s":"TX"},
  "48491":{"m":82,"c":"Williamson","s":"TX"},
  "48493":{"m":13,"c":"Wilson","s":"TX"},
  "48499":{"m":7,"c":"Wood","s":"TX"},
  "48505":{"m":19,"c":"Zapata","s":"TX"},
  "48507":{"m":7,"c":"Zavala","s":"TX"},
  "51013":{"m":8,"c":"Arlington","s":"VA"},
  "51041":{"m":73,"c":"Chesterfield","s":"VA"},
  "51059":{"m":31,"c":"Fairfax","s":"VA"},
  "51087":{"m":16,"c":"Henrico","s":"VA"},
  "51107":{"m":13,"c":"Loudoun","s":"VA"},
  "51153":{"m":45,"c":"Prince William","s":"VA"},
  "51177":{"m":9,"c":"Spotsylvania","s":"VA"},
  "51179":{"m":11,"c":"Stafford","s":"VA"},
  "51760":{"m":37,"c":"Richmond City","s":"VA"},
  "51810":{"m":26,"c":"Virginia Beach City","s":"VA"},
  "55009":{"m":4,"c":"Brown","s":"WI"},
  "55021":{"m":1,"c":"Columbia","s":"WI"},
  "55133":{"m":1,"c":"Waukesha","s":"WI"},
};

// ── STATE-LEVEL BOB ──
const BOB={AL:{m:131,a:6}, AZ:{m:150,a:10}, CA:{m:56,a:8}, CO:{m:420,a:20}, CT:{m:442,a:18}, DE:{m:284,a:15}, FL:{m:4161,a:78}, GA:{m:59,a:7}, LA:{m:100,a:5}, MI:{m:108,a:11}, NC:{m:1301,a:28}, NJ:{m:6603,a:100}, NY:{m:402,a:29}, OH:{m:382,a:15}, PA:{m:2748,a:52}, PR:{m:4,a:3}, RI:{m:416,a:12}, SC:{m:50,a:7}, TN:{m:41,a:9}, TX:{m:3284,a:59}, VA:{m:500,a:17}, WI:{m:6,a:2}};

const ELIGIBLE_ST={NJ:1800000,FL:5000000,TX:4200000,PA:2800000,NC:2200000,VA:1700000,CO:1100000,CT:800000,RI:250000,NY:3800000,OH:2400000,DE:220000,AZ:1600000,AL:1100000,MI:2200000,LA:900000,CA:6600000,GA:1900000,SC:1100000,TN:1500000,WI:1300000};

const MONTHLY_BY_STATE = {
  AL:{"2025-01":25, "2025-03":1, "2025-04":2, "2025-05":1, "2025-06":3, "2025-07":3, "2025-08":13, "2025-09":8, "2025-10":21, "2025-11":14, "2026-01":28, "2026-02":7, "2026-03":2, "2026-04":2},
  AZ:{"2024-01":1, "2025-01":31, "2025-02":7, "2025-03":11, "2025-04":7, "2025-06":7, "2025-07":11, "2025-08":7, "2025-09":12, "2025-10":5, "2025-11":8, "2025-12":5, "2026-01":27, "2026-02":6, "2026-03":2, "2026-04":1, "2026-06":1},
  CA:{"2024-09":1, "2025-01":27, "2025-02":5, "2025-05":2, "2025-06":2, "2025-07":2, "2025-08":3, "2025-09":1, "2025-10":2, "2026-01":5, "2026-02":2, "2026-03":1, "2026-04":1},
  CO:{"2024-02":1, "2025-01":36, "2025-03":5, "2025-04":6, "2025-05":20, "2025-06":8, "2025-07":2, "2025-08":3, "2025-09":23, "2025-10":25, "2025-11":16, "2025-12":7, "2026-01":184, "2026-02":62, "2026-03":11, "2026-04":7, "2026-05":1},
  CT:{"2025-01":42, "2025-02":3, "2025-04":2, "2025-05":6, "2025-06":9, "2025-07":4, "2025-08":19, "2025-09":14, "2025-10":19, "2025-11":9, "2025-12":8, "2026-01":218, "2026-02":57, "2026-03":17, "2026-04":6, "2026-05":2, "2026-07":1},
  DE:{"2025-01":32, "2025-02":4, "2025-03":3, "2025-04":3, "2025-05":5, "2025-06":2, "2025-07":5, "2025-08":3, "2025-09":6, "2025-10":5, "2025-11":4, "2026-01":190, "2026-02":4, "2026-03":6, "2026-04":11, "2026-06":1},
  FL:{"2023-11":1, "2024-01":2, "2024-03":1, "2024-05":1, "2024-09":1, "2025-01":911, "2025-02":62, "2025-03":127, "2025-04":153, "2025-05":257, "2025-06":326, "2025-07":210, "2025-08":218, "2025-09":215, "2025-10":242, "2025-11":154, "2025-12":68, "2026-01":911, "2026-02":153, "2026-03":57, "2026-04":46, "2026-05":18},
  GA:{"2025-01":8, "2025-02":1, "2025-03":1, "2025-04":2, "2025-05":2, "2025-06":9, "2025-07":6, "2025-08":8, "2025-09":5, "2025-10":3, "2026-01":9, "2026-02":2, "2026-04":3},
  LA:{"2025-01":1, "2025-09":1, "2025-11":8, "2026-01":53, "2026-02":23, "2026-03":10, "2026-04":6},
  MI:{"2025-01":7, "2025-02":4, "2025-03":4, "2025-04":6, "2025-05":9, "2025-06":5, "2025-07":4, "2025-08":6, "2025-09":11, "2025-10":3, "2025-11":3, "2025-12":1, "2026-01":23, "2026-02":4, "2026-04":13, "2026-05":4},
  NC:{"2024-01":1, "2024-07":2, "2024-08":1, "2024-09":1, "2025-01":418, "2025-02":17, "2025-03":40, "2025-04":78, "2025-05":60, "2025-06":83, "2025-07":35, "2025-08":24, "2025-09":49, "2025-10":28, "2025-11":37, "2025-12":11, "2026-01":266, "2026-02":77, "2026-03":28, "2026-04":28, "2026-05":10},
  NJ:{"2023-01":4, "2023-11":1, "2024-01":4, "2024-03":1, "2024-06":4, "2024-07":3, "2024-08":1, "2025-01":2942, "2025-02":141, "2025-03":214, "2025-04":257, "2025-05":190, "2025-06":218, "2025-07":183, "2025-08":203, "2025-09":203, "2025-10":131, "2025-11":124, "2025-12":59, "2026-01":885, "2026-02":220, "2026-03":144, "2026-04":185, "2026-05":77, "2026-06":1},
  NY:{"2024-01":1, "2024-07":1, "2025-01":112, "2025-02":15, "2025-03":14, "2025-04":5, "2025-05":9, "2025-06":9, "2025-07":15, "2025-08":15, "2025-09":19, "2025-10":9, "2025-11":6, "2025-12":3, "2026-01":120, "2026-02":29, "2026-03":6, "2026-04":8, "2026-05":1},
  OH:{"2025-01":24, "2025-02":3, "2025-03":1, "2025-04":1, "2025-05":3, "2025-06":7, "2025-07":3, "2025-08":7, "2025-09":6, "2025-10":1, "2025-11":34, "2025-12":28, "2026-01":185, "2026-02":60, "2026-03":10, "2026-04":4, "2026-05":2},
  PA:{"2024-07":1, "2024-09":1, "2024-11":1, "2025-01":483, "2025-02":51, "2025-03":85, "2025-04":121, "2025-05":103, "2025-06":116, "2025-07":43, "2025-08":53, "2025-09":68, "2025-10":128, "2025-11":161, "2025-12":101, "2026-01":876, "2026-02":163, "2026-03":88, "2026-04":72, "2026-05":7, "2026-06":1},
  RI:{"2025-01":34, "2025-02":3, "2025-03":6, "2025-04":3, "2025-05":6, "2025-06":2, "2025-07":3, "2025-08":4, "2025-09":25, "2025-10":25, "2025-11":16, "2026-01":227, "2026-02":31, "2026-03":7, "2026-04":16, "2026-05":3},
  SC:{"2024-11":1, "2025-01":18, "2025-02":1, "2025-04":2, "2025-05":1, "2025-06":4, "2025-07":2, "2025-08":3, "2025-09":2, "2025-12":1, "2026-01":8, "2026-02":1, "2026-03":4, "2026-04":3, "2026-05":1},
  TN:{"2024-02":1, "2024-04":1, "2024-05":2, "2024-06":1, "2024-07":2, "2024-11":1, "2025-01":2, "2025-03":1, "2025-05":1, "2025-06":1, "2025-08":2, "2025-09":4, "2025-10":6, "2025-12":1, "2026-01":14},
  TX:{"2023-01":1, "2024-01":2, "2024-02":1, "2024-04":1, "2024-07":1, "2024-08":1, "2024-09":3, "2024-11":3, "2025-01":754, "2025-02":112, "2025-03":69, "2025-04":147, "2025-05":179, "2025-06":211, "2025-07":110, "2025-08":170, "2025-09":197, "2025-10":162, "2025-11":101, "2025-12":21, "2026-01":742, "2026-02":145, "2026-03":55, "2026-04":74, "2026-05":10},
  VA:{"2025-01":84, "2025-02":9, "2025-03":13, "2025-04":6, "2025-05":23, "2025-06":24, "2025-07":18, "2025-08":17, "2025-09":29, "2025-10":19, "2025-11":12, "2026-01":164, "2026-02":43, "2026-03":13, "2026-04":19, "2026-05":3},
  WI:{"2026-02":6},
};
const CHART_MONTHS = [{key:"2023-01",label:"Jan '23",type:"AEP"}, {key:"2023-11",label:"Nov '23",type:"SEP"}, {key:"2024-01",label:"Jan '24",type:"AEP"}, {key:"2024-02",label:"Feb '24",type:"SEP"}, {key:"2024-03",label:"Mar '24",type:"SEP"}, {key:"2024-04",label:"Apr '24",type:"SEP"}, {key:"2024-05",label:"May '24",type:"SEP"}, {key:"2024-06",label:"Jun '24",type:"SEP"}, {key:"2024-07",label:"Jul '24",type:"SEP"}, {key:"2024-08",label:"Aug '24",type:"SEP"}, {key:"2024-09",label:"Sep '24",type:"SEP"}, {key:"2024-11",label:"Nov '24",type:"SEP"}, {key:"2025-01",label:"Jan '25",type:"AEP"}, {key:"2025-02",label:"Feb '25",type:"SEP"}, {key:"2025-03",label:"Mar '25",type:"SEP"}, {key:"2025-04",label:"Apr '25",type:"SEP"}, {key:"2025-05",label:"May '25",type:"SEP"}, {key:"2025-06",label:"Jun '25",type:"SEP"}, {key:"2025-07",label:"Jul '25",type:"SEP"}, {key:"2025-08",label:"Aug '25",type:"SEP"}, {key:"2025-09",label:"Sep '25",type:"SEP"}, {key:"2025-10",label:"Oct '25",type:"SEP"}, {key:"2025-11",label:"Nov '25",type:"SEP"}, {key:"2025-12",label:"Dec '25",type:"SEP"}, {key:"2026-01",label:"Jan '26",type:"AEP"}, {key:"2026-02",label:"Feb '26",type:"SEP"}, {key:"2026-03",label:"Mar '26",type:"SEP"}, {key:"2026-04",label:"Apr '26",type:"SEP"}, {key:"2026-05",label:"May '26",type:"SEP"}, {key:"2026-06",label:"Jun '26",type:"SEP"}, {key:"2026-07",label:"Jul '26",type:"SEP"}];

const AGENCIES = [
  {full:"ALLCARE MAR AGENCY LLC",short:"AllCare Mar",m:8330,a:67,states:["NJ","PA","FL","TX","VA","NC","DE","CT","NY","AL","LA","CO","MI","AZ","CA","RI","TN","SC","GA","OH"]},
  {full:"CONCEP CARE INSURANCE AGENCY,",short:"Concep Care",m:5362,a:23,states:["FL","NJ","TX","NC","RI","PA","OH","CT","CO","VA","GA","CA","MI","TN","AL","DE","SC","AZ","WI"]},
  {full:"GW INS GROUP LLC",short:"GW Ins Group",m:1641,a:14,states:["NJ","FL","TX","PA","OH","AZ","CT","NC","VA","NY","SC","DE"]},
  {full:"SIMAROVA SENIOR SOLUTIONS LLC DBA SIMAROVA SENIOR INSURANCE SOLUTIONS",short:"Simarova Senior",m:1614,a:9,states:["TX","FL","CO","NC","RI","PA","OH","CT","NJ","MI","LA","WI","VA","AZ"]},
  {full:"KMRA GROUP, LLC",short:"KMRA Group",m:1132,a:10,states:["PA","NJ","TX","FL"]},
  {full:"MARTELL MULTI SERVICE LLC",short:"Martell Multi",m:1031,a:10,states:["NJ","PA","TX","NY"]},
  {full:"TCS & ASSOCIATES LLC",short:"TCS & Associates",m:977,a:14,states:["TX","FL","NC","NJ","LA"]},
  {full:"AMC CARE GROUP LLC,",short:"AMC Care Group",m:730,a:4,states:["TX","NC","PA","CO","CT","MI","NY","OH","SC","LA","NJ","FL","CA"]},
  {full:"TOP TIER HEALTH CONSULTANTS LLC",short:"Top Tier Health",m:356,a:6,states:["NY","NJ","DE"]},
  {full:"JPM SOLUTIONS",short:"JPM Solutions",m:193,a:4,states:["NJ","PA","TX","FL","AL","NY","DE"]},
  {full:"ORIGIN INSURANCE GROUP LLC",short:"Origin Insurance",m:5,a:1,states:["NJ"]},
  {full:"GANDHI, MANISH",short:"Gandhi, Manish",m:4,a:1,states:["NJ"]},
  {full:"NEXTGEN HEALTH AGENCY LLC",short:"NextGen Health",m:4,a:1,states:["NJ"]},
];

const AGENCY_DATA = {
  "AllCare Mar": {
    total:8330, uniqueAgents:67,
    states:["NJ","PA","FL","TX","VA","NC","DE","CT","NY","AL","LA","CO","MI","AZ","CA","RI","TN","SC","GA","OH"],
    bobState:{AL:{m:96,a:3}, AZ:{m:44,a:3}, CA:{m:27,a:5}, CO:{m:51,a:4}, CT:{m:171,a:8}, DE:{m:239,a:9}, FL:{m:1066,a:34}, GA:{m:6,a:4}, LA:{m:74,a:2}, MI:{m:50,a:4}, NC:{m:368,a:13}, NJ:{m:3727,a:50}, NY:{m:162,a:19}, OH:{m:1,a:1}, PA:{m:1128,a:16}, RI:{m:17,a:3}, SC:{m:12,a:4}, TN:{m:16,a:6}, TX:{m:646,a:15}, VA:{m:414,a:10}},
    aps:{AL:3, AZ:3, CA:5, CO:4, CT:8, DE:9, FL:34, GA:4, LA:2, MI:4, NC:13, NJ:50, NY:19, OH:1, PA:16, RI:3, SC:4, TN:6, TX:15, VA:10},
    monthly:{AL:{"2025-01":19,"2025-04":2,"2025-05":1,"2025-06":2,"2025-07":3,"2025-08":13,"2025-09":7,"2025-10":14,"2025-11":13,"2026-01":18,"2026-02":1,"2026-03":1,"2026-04":2}, AZ:{"2025-01":9,"2025-02":1,"2025-03":4,"2025-04":1,"2025-06":6,"2025-07":1,"2025-09":6,"2025-10":2,"2025-11":3,"2025-12":2,"2026-01":7,"2026-02":2}, CA:{"2025-01":13,"2025-02":5,"2025-07":1,"2025-08":2,"2025-10":1,"2026-01":5}, CO:{"2025-01":12,"2025-03":4,"2025-04":2,"2025-05":15,"2025-06":2,"2025-08":1,"2025-09":2,"2026-01":8,"2026-02":5}, CT:{"2025-01":26,"2025-02":2,"2025-04":2,"2025-05":2,"2025-06":1,"2025-07":1,"2025-09":1,"2025-10":1,"2025-12":1,"2026-01":98,"2026-02":26,"2026-03":8,"2026-04":2}, DE:{"2025-01":31,"2025-02":2,"2025-03":2,"2025-04":3,"2025-05":4,"2025-06":2,"2025-07":3,"2025-08":2,"2025-09":6,"2025-10":5,"2025-11":2,"2026-01":157,"2026-02":4,"2026-03":5,"2026-04":11}, FL:{"2023-11":1,"2024-01":2,"2024-05":1,"2025-01":198,"2025-02":12,"2025-03":30,"2025-04":30,"2025-05":51,"2025-06":82,"2025-07":82,"2025-08":106,"2025-09":78,"2025-10":59,"2025-11":63,"2025-12":30,"2026-01":182,"2026-02":29,"2026-03":13,"2026-04":11,"2026-05":6}, GA:{"2025-01":1,"2025-02":1,"2025-09":1,"2026-01":1,"2026-02":2}, LA:{"2025-11":7,"2026-01":49,"2026-02":10,"2026-03":8}, MI:{"2025-01":2,"2025-02":4,"2025-03":1,"2025-04":6,"2025-05":4,"2025-06":4,"2025-07":1,"2025-08":1,"2025-09":6,"2025-10":3,"2025-11":1,"2025-12":1,"2026-01":12,"2026-02":3,"2026-04":1}, NC:{"2024-01":1,"2024-09":1,"2025-01":206,"2025-02":9,"2025-03":12,"2025-04":28,"2025-05":10,"2025-06":10,"2025-07":6,"2025-08":4,"2025-09":7,"2025-10":6,"2025-11":10,"2025-12":2,"2026-01":43,"2026-02":6,"2026-03":2,"2026-04":1,"2026-05":4}, NJ:{"2023-01":4,"2023-11":1,"2024-01":4,"2024-06":2,"2024-08":1,"2025-01":1849,"2025-02":84,"2025-03":115,"2025-04":138,"2025-05":122,"2025-06":130,"2025-07":110,"2025-08":109,"2025-09":97,"2025-10":75,"2025-11":73,"2025-12":17,"2026-01":482,"2026-02":124,"2026-03":63,"2026-04":79,"2026-05":47,"2026-06":1}, NY:{"2024-01":1,"2024-07":1,"2025-01":55,"2025-02":9,"2025-03":9,"2025-04":3,"2025-05":5,"2025-06":6,"2025-07":5,"2025-08":13,"2025-09":3,"2025-10":7,"2025-11":5,"2025-12":2,"2026-01":30,"2026-02":6,"2026-04":2}, OH:{"2026-02":1}, PA:{"2024-09":1,"2025-01":338,"2025-02":33,"2025-03":62,"2025-04":77,"2025-05":68,"2025-06":53,"2025-07":23,"2025-08":24,"2025-09":23,"2025-10":41,"2025-11":31,"2025-12":4,"2026-01":279,"2026-02":31,"2026-03":24,"2026-04":13,"2026-05":2,"2026-06":1}, RI:{"2025-01":11,"2025-02":2,"2025-05":1,"2025-08":2,"2026-01":1}, SC:{"2025-01":4,"2025-04":1,"2025-06":1,"2025-08":1,"2025-09":1,"2026-01":4}, TN:{"2024-05":2,"2025-03":1,"2025-06":1,"2025-09":4,"2025-10":1,"2025-12":1,"2026-01":6}, TX:{"2023-01":1,"2025-01":213,"2025-02":34,"2025-03":20,"2025-04":37,"2025-05":27,"2025-06":19,"2025-07":22,"2025-08":22,"2025-09":26,"2025-10":16,"2025-11":20,"2025-12":3,"2026-01":143,"2026-02":23,"2026-03":7,"2026-04":12,"2026-05":1}, VA:{"2025-01":73,"2025-02":8,"2025-03":11,"2025-04":4,"2025-05":22,"2025-06":21,"2025-07":15,"2025-08":13,"2025-09":23,"2025-10":17,"2025-11":10,"2026-01":123,"2026-02":42,"2026-03":11,"2026-04":18,"2026-05":3}},
    plans:{AL:[{"p":"Dual Complete AL-S1","m":87}, {"p":"Dual Complete AL-V002","m":7}, {"p":"AARP MA UHC AL-6","m":1}, {"p":"Dual Complete AL-D001","m":1}], AZ:[{"p":"Dual Complete AZ-S001","m":21}, {"p":"AARP MA Extras AZ-5","m":6}, {"p":"UHC Complete Care AZ-1P","m":6}, {"p":"AARP MA Extras AZ-4","m":4}, {"p":"AARP Medicare Advantage CareFlex from UH","m":1}, {"p":"AARP MA Essentials AZ-2","m":1}, {"p":"AARP MA UHC AZ-0010","m":1}, {"p":"AARP MA UHC AZ-002P","m":1}], CA:[{"p":"AARP MA UHC CA-0005","m":4}, {"p":"AARP MA UHC CA-0010","m":4}, {"p":"AARP MA UHC CA-006P","m":4}, {"p":"UHC Complete Care CA-18P","m":3}, {"p":"AARP MA UHC CA-004P","m":2}, {"p":"AARP MA UHC CA-023P","m":2}, {"p":"AARP Medicare Advantage Giveback from UH","m":1}, {"p":"AARP MA UHC CA-0002","m":1}], CO:[{"p":"Dual Complete CO-S4","m":35}, {"p":"Dual Complete CO-S002","m":8}, {"p":"AARP MA Extras CO-5","m":3}, {"p":"Dual Complete CO-V001","m":2}, {"p":"AARP MA Extras CO-20","m":1}, {"p":"AARP Medicare Advantage Patriot No Rx CO","m":1}, {"p":"AARP MA UHC CO-0013","m":1}], CT:[{"p":"Dual Complete CT-S2","m":129}, {"p":"Dual Complete CT-Q001","m":22}, {"p":"Dual Complete CT-S001","m":16}, {"p":"UHC Medicare Advantage CT-0002","m":3}, {"p":"UHC Medicare Advantage Patriot No Rx CT-","m":1}], DE:[{"p":"UHC Complete Care Support DE-5A","m":193}, {"p":"AARP MA Extras DE-6","m":29}, {"p":"UHC Complete Care DE-4","m":15}, {"p":"AARP MA Essentials DE-3","m":1}, {"p":"AARP MA UHC DE-0002","m":1}], FL:[{"p":"Dual Complete FL-Y5","m":414}, {"p":"Dual Complete FL-Y4","m":262}, {"p":"UHC Preferred Dual Complete FL-Y2","m":180}, {"p":"Dual Complete FL-D002","m":39}, {"p":"UHC Preferred Dual Complete FL-Y3","m":36}, {"p":"UHC Complete Care FL-14","m":19}, {"p":"Dual Complete FL-D003","m":15}, {"p":"UHC Preferred Dual Complete FL-D001","m":11}], GA:[{"p":"AARP MA UHC GA-5","m":3}, {"p":"UHC Complete Care Support GS-1A","m":1}, {"p":"Dual Complete GA-D2","m":1}, {"p":"Dual Complete GA-S3","m":1}], LA:[{"p":"Peoples Health Dual Complete LA-S5","m":62}, {"p":"Peoples Health Secure Complete","m":11}, {"p":"Peoples Health Choices 65","m":1}], MI:[{"p":"Dual Complete MI-Y1","m":36}, {"p":"Dual Complete MI-S3","m":7}, {"p":"UHC Complete Care Support MI-3","m":2}, {"p":"Dual Complete MI-S002","m":2}, {"p":"AARP MA UHC MI-0001","m":1}, {"p":"AARP MA UHC MI-0002","m":1}, {"p":"Dual Complete MI-S001","m":1}], NC:[{"p":"Dual Complete NC-S3","m":221}, {"p":"AARP MA UHC NC-0015","m":47}, {"p":"Dual Complete NC-D001","m":23}, {"p":"AARP MA UHC NC-24","m":17}, {"p":"AARP MA UHC NC-0021","m":14}, {"p":"AARP MA UHC NC-26","m":8}, {"p":"Dual Complete NC-V001","m":8}, {"p":"Dual Complete NC-S001","m":7}], NJ:[{"p":"AARP MA UHC NJ-0005","m":1793}, {"p":"Dual Complete NJ-Y001","m":1082}, {"p":"AARP MA Extras NJ-7","m":576}, {"p":"AARP MA UHC NJ-6","m":119}, {"p":"AARP MA Essentials NJ-1","m":76}, {"p":"AARP MA UHC NJ-0004","m":72}, {"p":"AARP MA UHC NJ-0002","m":3}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":2}], NY:[{"p":"AARP MA UHC NY-0005","m":63}, {"p":"Dual Complete NY-S002","m":48}, {"p":"AARP Medicare Advantage Patriot No Rx NY","m":19}, {"p":"AARP MA UHC NY-29","m":9}, {"p":"AARP MA UHC NY-0012","m":8}, {"p":"Dual Complete NY-S001","m":5}, {"p":"AARP MA UHC NY-34","m":4}, {"p":"AARP MA UHC NY-0006","m":2}], OH:[{"p":"Dual Complete OH-S3","m":1}], PA:[{"p":"Dual Complete PA-S3","m":934}, {"p":"Dual Complete PA-S002","m":59}, {"p":"AARP MA UHC PA-0007","m":20}, {"p":"UHC Complete Care PA-17","m":20}, {"p":"AARP MA Extras PA-18","m":18}, {"p":"AARP MA UHC PA-0002","m":16}, {"p":"AARP MA UHC PA-0001","m":15}, {"p":"AARP MA UHC PA-0011","m":13}], RI:[{"p":"AARP MA UHC RI-0003","m":12}, {"p":"UHC Complete Care RI-4","m":5}], SC:[{"p":"Dual Complete SC-S001","m":4}, {"p":"AARP MA UHC SC-0006","m":3}, {"p":"UHC Complete Care Support SC-7","m":2}, {"p":"UHC Complete Care SC-1","m":1}, {"p":"Dual Complete SC-S2","m":1}, {"p":"Dual Complete SC-V001","m":1}], TN:[{"p":"AARP Medicare Advantage Giveback from UH","m":5}, {"p":"Dual Complete TN-Y2","m":5}, {"p":"AARP MA UHC TN-0003","m":2}, {"p":"AARP MA UHC TN-0006","m":2}, {"p":"AARP MA UHC TC-0003","m":1}, {"p":"Dual Complete TN-S001","m":1}], TX:[{"p":"Dual Complete TX-S003","m":317}, {"p":"AARP MA UHC TX-46","m":35}, {"p":"AARP MA UHC TX-001P","m":26}, {"p":"UHC Complete Care TX-16","m":26}, {"p":"Dual Complete TX-D002","m":22}, {"p":"AARP MA Essentials TX-12","m":21}, {"p":"Dual Complete TX-Q3","m":19}, {"p":"AARP Medicare Advantage Patriot No Rx TX","m":17}], VA:[{"p":"Dual Complete VA-Y002","m":236}, {"p":"Dual Complete VA-Y001","m":61}, {"p":"AARP MA UHC VA-0004","m":17}, {"p":"Dual Complete VA-V001","m":15}, {"p":"Dual Complete VA-Q001","m":14}, {"p":"AARP MA UHC VA-0008","m":13}, {"p":"AARP MA UHC VA-0011","m":13}, {"p":"AARP MA UHC VA-0012","m":11}]},
    agents:[{n:"Fernandez, Jonathan",m:722,s:"NJ",ss:["FL","NJ","PA"],bs:{FL:10,NJ:509,PA:203},agency:"AllCare Mar"}, {n:"Ayala Negron, Adriana",m:659,s:"PA",ss:["CA","CT","DE","FL","NC","NJ","NY","PA","TX"],bs:{CA:1,CT:52,DE:21,FL:14,NC:3,NJ:275,NY:4,PA:278,TX:11},agency:"AllCare Mar"}, {n:"Santiago, Maria",m:629,s:"NJ",ss:["AL","CA","CT","FL","GA","LA","NJ","NY","PA","RI","TX"],bs:{AL:75,CA:1,CT:1,FL:61,GA:3,LA:61,NJ:387,NY:19,PA:4,RI:10,TX:7},agency:"AllCare Mar"}, {n:"Ortega, Carlos",m:583,s:"NC",ss:["CA","FL","LA","NC","NJ","NY","OH","PA","SC","TN","TX"],bs:{CA:1,FL:8,LA:9,NC:476,NJ:5,NY:2,OH:11,PA:35,SC:14,TN:3,TX:19},agency:"AllCare Mar"}, {n:"Martin, Alvorine",m:522,s:"NJ",ss:["NC","NJ","NY","PA","SC","TX"],bs:{NC:2,NJ:263,NY:11,PA:2,SC:1,TX:243},agency:"AllCare Mar"}, {n:"Monsalve, Maria",m:506,s:"NJ",ss:["DE","FL","NJ","NY","PA"],bs:{DE:5,FL:3,NJ:494,NY:3,PA:1},agency:"AllCare Mar"}, {n:"Quinones Medina, Christian",m:502,s:"TX",ss:["AZ","CO","CT","FL","GA","NC","NJ","PA","SC","TX","VA"],bs:{AZ:12,CO:8,CT:58,FL:34,GA:1,NC:24,NJ:98,PA:108,SC:3,TX:154,VA:2},agency:"AllCare Mar"}, {n:"Nexuscare Innovations Dba Nexuscare Insurance Agency",m:374,s:"NJ",ss:["AZ","CA","CO","CT","FL","MI","NC","NJ","NY","PA","RI","SC","TN","TX","VA"],bs:{AZ:25,CA:11,CO:16,CT:5,FL:35,MI:6,NC:3,NJ:96,NY:25,PA:49,RI:1,SC:4,TN:3,TX:84,VA:11},agency:"AllCare Mar"}, {n:"Nunez, Alicia",m:334,s:"VA",ss:["NJ","NY","VA"],bs:{NJ:12,NY:20,VA:302},agency:"AllCare Mar"}, {n:"Rodriguez-martinez, Marcos",m:302,s:"NJ",ss:["CA","FL","NC","NJ","NY","OH","RI"],bs:{CA:13,FL:1,NC:1,NJ:274,NY:6,OH:1,RI:6},agency:"AllCare Mar"}, {n:"Munoz, Francia",m:277,s:"NJ",ss:["DE","FL","NC","NJ"],bs:{DE:1,FL:1,NC:1,NJ:274},agency:"AllCare Mar"}, {n:"Fernandez Abreu, Mercedes",m:270,s:"FL",ss:["FL","NJ"],bs:{FL:219,NJ:51},agency:"AllCare Mar"}, {n:"Christopher, Ana",m:265,s:"TX",ss:["CA","CO","CT","FL","GA","NJ","PA","TX"],bs:{CA:2,CO:35,CT:59,FL:8,GA:1,NJ:8,PA:67,TX:85},agency:"AllCare Mar"}, {n:"Sanchez Vazquez, Carlos",m:256,s:"PA",ss:["FL","MI","NC","NJ","PA","TX","VA"],bs:{FL:1,MI:36,NC:9,NJ:43,PA:144,TX:18,VA:5},agency:"AllCare Mar"}, {n:"Galarza, Priscilla",m:236,s:"FL",ss:["CT","FL","NJ","NY"],bs:{CT:24,FL:191,NJ:14,NY:7},agency:"AllCare Mar"}, {n:"Jimenez, Oliver",m:220,s:"NJ",ss:["CT","DE","FL","NC","NJ","NY","PA","TN"],bs:{CT:1,DE:13,FL:4,NC:42,NJ:134,NY:2,PA:20,TN:4},agency:"AllCare Mar"}, {n:"Vega, Julian",m:188,s:"NJ",ss:["AL","FL","NJ","NY","TX"],bs:{AL:10,FL:14,NJ:138,NY:25,TX:1},agency:"AllCare Mar"}, {n:"Read Jacobo, Mariela",m:180,s:"FL",ss:["FL","NJ"],bs:{FL:169,NJ:11},agency:"AllCare Mar"}, {n:"Peguero Ruiz, Paola",m:169,s:"PA",ss:["DE","FL","NJ","PA","TX"],bs:{DE:34,FL:40,NJ:6,PA:81,TX:8},agency:"AllCare Mar"}, {n:"Gonzalez Rodriguez, Jason",m:146,s:"PA",ss:["CO","FL","PA","TX"],bs:{CO:18,FL:7,PA:101,TX:20},agency:"AllCare Mar"}, {n:"Perez Ferreira, Carlos",m:146,s:"NJ",ss:["FL","NJ","NY","PA","TX"],bs:{FL:2,NJ:113,NY:27,PA:3,TX:1},agency:"AllCare Mar"}, {n:"Gil, Ramon",m:124,s:"DE",ss:["DE","NJ","NY"],bs:{DE:102,NJ:15,NY:7},agency:"AllCare Mar"}, {n:"Diaz Garcia, Jose",m:113,s:"NJ",ss:["AZ","CO","FL","MI","NC","NJ","TN","TX"],bs:{AZ:7,CO:9,FL:14,MI:6,NC:7,NJ:55,TN:4,TX:11},agency:"AllCare Mar"}, {n:"Giunto, Glorivette",m:109,s:"NJ",ss:["FL","NJ","NY"],bs:{FL:1,NJ:104,NY:4},agency:"AllCare Mar"}, {n:"Colon Perez, Yaisha",m:103,s:"FL",ss:["FL","NJ","VA"],bs:{FL:51,NJ:51,VA:1},agency:"AllCare Mar"}, {n:"Liriano, Felix",m:93,s:"VA",ss:["NJ","VA"],bs:{NJ:3,VA:90},agency:"AllCare Mar"}, {n:"Acosta, Nancy",m:89,s:"NJ",ss:["DE","FL","NJ"],bs:{DE:32,FL:22,NJ:35},agency:"AllCare Mar"}, {n:"Rodriguez Rosich, Carlos",m:87,s:"PA",ss:["FL","PA","TX","VA"],bs:{FL:1,PA:80,TX:5,VA:1},agency:"AllCare Mar"}, {n:"National Contracting Center Inc",m:47,s:"NJ",ss:["NJ"],bs:{NJ:47},agency:"AllCare Mar"}, {n:"Hyman, Ulysses",m:41,s:"DE",ss:["DE","NJ"],bs:{DE:28,NJ:13},agency:"AllCare Mar"}, {n:"Allcare Mar Agency Llc",m:40,s:"NJ",ss:["FL","NC","NJ"],bs:{FL:1,NC:1,NJ:38},agency:"AllCare Mar"}, {n:"Soriano, Elias",m:36,s:"NJ",ss:["NJ"],bs:{NJ:36},agency:"AllCare Mar"}, {n:"Rosario, Maria",m:31,s:"FL",ss:["FL"],bs:{FL:31},agency:"AllCare Mar"}, {n:"Faulcon, Cadorsil",m:24,s:"NJ",ss:["NJ","PA"],bs:{NJ:23,PA:1},agency:"AllCare Mar"}, {n:"Rodriguez, Luis",m:22,s:"AL",ss:["AL","NJ","TN"],bs:{AL:16,NJ:4,TN:2},agency:"AllCare Mar"}, {n:"Beltran, Mindi",m:17,s:"TX",ss:["TX"],bs:{TX:17},agency:"AllCare Mar"}, {n:"Puente, Sandra",m:17,s:"NJ",ss:["NJ"],bs:{NJ:17},agency:"AllCare Mar"}, {n:"Arratia Araneda, Nicole",m:14,s:"FL",ss:["FL","NJ"],bs:{FL:10,NJ:4},agency:"AllCare Mar"}, {n:"Gandhi, Manish",m:12,s:"NJ",ss:["NJ"],bs:{NJ:12},agency:"AllCare Mar"}, {n:"Cruz, Lissette",m:10,s:"NJ",ss:["NJ","NY"],bs:{NJ:8,NY:2},agency:"AllCare Mar"}, {n:"Veitia Mendez, Idalmis",m:7,s:"FL",ss:["FL"],bs:{FL:7},agency:"AllCare Mar"}, {n:"Gray, Tayler",m:6,s:"NJ",ss:["NJ"],bs:{NJ:6},agency:"AllCare Mar"}, {n:"Rodriguez Contreras, Sixto",m:5,s:"NJ",ss:["NJ"],bs:{NJ:5},agency:"AllCare Mar"}, {n:"Contreras, Natalie",m:4,s:"NJ",ss:["CT","NJ","NY"],bs:{CT:1,NJ:2,NY:1},agency:"AllCare Mar"}, {n:"Pujols De Gonzalez, Luz",m:3,s:"NJ",ss:["NJ"],bs:{NJ:3},agency:"AllCare Mar"}, {n:"Walker, Jamilla",m:3,s:"NJ",ss:["NJ"],bs:{NJ:3},agency:"AllCare Mar"}, {n:"Marciano, Alysia",m:2,s:"FL",ss:["FL","NJ"],bs:{FL:1,NJ:1},agency:"AllCare Mar"}, {n:"Elmenayer, Wafaa",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"AllCare Mar"}],
  },
  "Concep Care": {
    total:5362, uniqueAgents:23,
    states:["FL","NJ","TX","NC","RI","PA","OH","CT","CO","VA","GA","CA","MI","TN","AL","DE","SC","AZ","WI"],
    bobState:{AL:{m:22,a:2}, AZ:{m:12,a:3}, CA:{m:25,a:2}, CO:{m:143,a:9}, CT:{m:151,a:5}, DE:{m:21,a:2}, FL:{m:1781,a:21}, GA:{m:53,a:3}, MI:{m:24,a:3}, NC:{m:483,a:8}, NJ:{m:936,a:17}, OH:{m:203,a:6}, PA:{m:245,a:13}, RI:{m:295,a:4}, SC:{m:19,a:2}, TN:{m:24,a:4}, TX:{m:855,a:14}, VA:{m:58,a:6}, WI:{m:3,a:1}},
    aps:{AL:2, AZ:3, CA:2, CO:9, CT:5, DE:2, FL:21, GA:3, MI:3, NC:8, NJ:17, OH:6, PA:13, RI:4, SC:2, TN:4, TX:14, VA:6, WI:1},
    monthly:{AL:{"2025-01":5,"2025-03":1,"2025-06":1,"2025-09":1,"2025-10":7,"2026-01":2,"2026-02":5}, AZ:{"2025-01":2,"2025-04":3,"2025-07":3,"2025-08":2,"2025-10":1,"2026-01":1}, CA:{"2025-01":14,"2025-05":2,"2025-06":2,"2025-07":1,"2025-08":1,"2025-09":1,"2026-02":2,"2026-03":1,"2026-04":1}, CO:{"2024-02":1,"2025-01":12,"2025-04":1,"2025-05":2,"2025-06":4,"2025-07":1,"2025-08":2,"2025-09":9,"2025-10":1,"2025-11":8,"2025-12":1,"2026-01":74,"2026-02":15,"2026-03":6,"2026-04":5,"2026-05":1}, CT:{"2025-01":6,"2025-05":2,"2025-06":4,"2025-07":1,"2025-08":15,"2025-09":1,"2025-11":1,"2025-12":4,"2026-01":103,"2026-02":5,"2026-03":6,"2026-04":2,"2026-05":1}, DE:{"2025-02":2,"2025-03":1,"2025-05":1,"2025-07":1,"2025-08":1,"2026-01":14,"2026-06":1}, FL:{"2024-03":1,"2024-09":1,"2025-01":547,"2025-02":43,"2025-03":77,"2025-04":68,"2025-05":95,"2025-06":110,"2025-07":56,"2025-08":44,"2025-09":54,"2025-10":78,"2025-11":32,"2025-12":9,"2026-01":464,"2026-02":52,"2026-03":23,"2026-04":20,"2026-05":7}, GA:{"2025-01":7,"2025-03":1,"2025-04":2,"2025-05":2,"2025-06":9,"2025-07":6,"2025-08":8,"2025-09":4,"2025-10":3,"2026-01":8,"2026-04":3}, MI:{"2025-01":1,"2025-03":1,"2025-05":3,"2025-06":1,"2025-07":1,"2026-01":1,"2026-04":12,"2026-05":4}, NC:{"2024-08":1,"2025-01":164,"2025-02":6,"2025-03":19,"2025-04":37,"2025-05":25,"2025-06":26,"2025-07":14,"2025-08":11,"2025-09":10,"2025-10":8,"2025-11":7,"2025-12":3,"2026-01":113,"2026-02":14,"2026-03":19,"2026-04":6}, NJ:{"2025-01":592,"2025-02":21,"2025-03":22,"2025-04":34,"2025-05":26,"2025-06":24,"2025-07":24,"2025-08":33,"2025-09":28,"2025-10":17,"2025-11":11,"2025-12":1,"2026-01":61,"2026-02":7,"2026-03":6,"2026-04":21,"2026-05":8}, OH:{"2025-01":10,"2025-02":1,"2025-06":3,"2025-08":3,"2025-09":3,"2025-10":1,"2025-11":10,"2025-12":4,"2026-01":141,"2026-02":18,"2026-03":5,"2026-04":4}, PA:{"2024-07":1,"2025-01":42,"2025-02":7,"2025-03":16,"2025-04":25,"2025-05":15,"2025-06":11,"2025-07":5,"2025-08":3,"2025-09":6,"2025-10":6,"2025-11":8,"2025-12":1,"2026-01":80,"2026-02":2,"2026-03":6,"2026-04":10,"2026-05":1}, RI:{"2025-01":22,"2025-02":1,"2025-03":6,"2025-04":3,"2025-05":5,"2025-06":2,"2025-07":3,"2025-08":2,"2025-09":24,"2025-10":25,"2025-11":15,"2026-01":160,"2026-02":19,"2026-03":2,"2026-04":5,"2026-05":1}, SC:{"2025-01":9,"2025-02":1,"2025-04":1,"2025-06":2,"2025-07":1,"2025-09":1,"2026-01":1,"2026-02":1,"2026-04":2}, TN:{"2024-02":1,"2024-04":1,"2024-06":1,"2024-07":2,"2024-11":1,"2025-01":2,"2025-05":1,"2025-08":2,"2025-10":5,"2026-01":8}, TX:{"2024-04":1,"2024-11":1,"2025-01":355,"2025-02":57,"2025-03":27,"2025-04":39,"2025-05":44,"2025-06":67,"2025-07":36,"2025-08":44,"2025-09":42,"2025-10":27,"2025-11":16,"2025-12":3,"2026-01":70,"2026-02":13,"2026-03":2,"2026-04":9,"2026-05":2}, VA:{"2025-01":6,"2025-02":1,"2025-03":2,"2025-06":1,"2025-07":1,"2025-08":2,"2025-09":2,"2025-10":2,"2026-01":38,"2026-03":2,"2026-04":1}, WI:{"2026-02":3}},
    plans:{AL:[{"p":"Dual Complete AL-S1","m":20}, {"p":"Dual Complete AL-D001","m":2}], AZ:[{"p":"Dual Complete AZ-S001","m":11}, {"p":"AARP MA UHC AZ-002P","m":1}], CA:[{"p":"AARP MA UHC CA-004P","m":18}, {"p":"AARP MA UHC CA-021P","m":3}, {"p":"AARP MA UHC CA-0015","m":1}, {"p":"AARP MA UHC CA-022P","m":1}, {"p":"AARP MA UHC CA-37","m":1}, {"p":"AARP MA UHC CA-43","m":1}], CO:[{"p":"Dual Complete CO-S4","m":132}, {"p":"Dual Complete CO-S002","m":8}, {"p":"AARP MA Extras CO-20","m":2}, {"p":"Dual Complete CO-S001","m":1}], CT:[{"p":"Dual Complete CT-S2","m":135}, {"p":"Dual Complete CT-Q001","m":11}, {"p":"Dual Complete CT-S001","m":5}], DE:[{"p":"UHC Complete Care Support DE-5A","m":17}, {"p":"AARP MA Essentials DE-3","m":2}, {"p":"AARP MA Extras DE-6","m":1}, {"p":"UHC Complete Care DE-4","m":1}], FL:[{"p":"Dual Complete FL-Y5","m":1309}, {"p":"Dual Complete FL-Y4","m":232}, {"p":"Dual Complete FL-D002","m":52}, {"p":"UHC Preferred Dual Complete FL-Y2","m":48}, {"p":"UHC Preferred Medicare Advantage FL-0002","m":27}, {"p":"Dual Complete FL-Y001","m":16}, {"p":"UHC MedicareMax Dual Complete FL-Y6","m":13}, {"p":"Dual Complete FL-D006","m":12}], GA:[{"p":"Dual Complete GA-S3","m":23}, {"p":"Dual Complete GA-D2","m":14}, {"p":"Dual Complete GA-S2","m":8}, {"p":"Dual Complete GA-S1","m":6}, {"p":"UHC Complete Care GA-3","m":1}, {"p":"UHC Complete Care Support GA-9","m":1}], MI:[{"p":"Dual Complete MI-S3","m":18}, {"p":"UHC Complete Care Support MI-3","m":2}, {"p":"Dual Complete MI-Y1","m":2}, {"p":"AARP MA UHC MI-0001","m":1}, {"p":"AARP MA UHC MI-0002","m":1}], NC:[{"p":"Dual Complete NC-S3","m":417}, {"p":"Dual Complete NC-D001","m":26}, {"p":"AARP MA UHC NC-0015","m":9}, {"p":"Dual Complete NC-S001","m":8}, {"p":"UHC Complete Care NC-28","m":7}, {"p":"AARP MA UHC NC-0021","m":5}, {"p":"AARP MA UHC NC-26","m":3}, {"p":"AARP MA UHC NC-0001","m":2}], NJ:[{"p":"AARP MA UHC NJ-0005","m":639}, {"p":"Dual Complete NJ-Y001","m":220}, {"p":"AARP MA Extras NJ-7","m":37}, {"p":"AARP MA Essentials NJ-1","m":14}, {"p":"AARP MA UHC NJ-0004","m":12}, {"p":"AARP MA UHC NJ-6","m":11}, {"p":"AARP MA UHC NJ-0002","m":3}], OH:[{"p":"Dual Complete OH-S3","m":106}, {"p":"Dual Complete OH-S2","m":80}, {"p":"Dual Complete OH-D001","m":11}, {"p":"UHC Complete Care OH-18","m":4}, {"p":"AARP MA UHC OH-18","m":2}], PA:[{"p":"Dual Complete PA-S3","m":213}, {"p":"Dual Complete PA-S002","m":17}, {"p":"AARP MA UHC PA-0007","m":7}, {"p":"AARP MA Extras PA-18","m":2}, {"p":"AARP MA UHC PA-0001","m":1}, {"p":"AARP MA UHC PA-0002","m":1}, {"p":"AARP MA UHC PA-0009","m":1}, {"p":"AARP MA UHC PA-0011","m":1}], RI:[{"p":"Dual Complete RI-S3","m":290}, {"p":"Dual Complete RI-S001","m":2}, {"p":"AARP Medicare Advantage CareFlex from UH","m":1}, {"p":"AARP MA UHC RI-0002","m":1}, {"p":"Dual Complete RI-V001","m":1}], SC:[{"p":"AARP MA UHC SC-0004","m":9}, {"p":"AARP MA UHC SC-0006","m":2}, {"p":"UHC Complete Care SC-1","m":2}, {"p":"Dual Complete SC-S001","m":2}, {"p":"Dual Complete SC-S2","m":2}, {"p":"UHC Complete Care Support SC-7","m":1}, {"p":"Dual Complete SC-V001","m":1}], TN:[{"p":"Dual Complete TN-Y2","m":15}, {"p":"Dual Complete TN-Y001","m":4}, {"p":"Dual Complete TN-S001","m":2}, {"p":"AARP MA UHC TC-0003","m":1}, {"p":"AARP MA UHC TN-0006","m":1}, {"p":"UHC Complete Care Support TC-6","m":1}], TX:[{"p":"Dual Complete TX-S003","m":527}, {"p":"AARP MA UHC TX-0043","m":60}, {"p":"AARP MA UHC TX-001P","m":35}, {"p":"Dual Complete TX-Q3","m":20}, {"p":"Dual Complete TX-D003","m":19}, {"p":"Dual Complete TX-Y1","m":17}, {"p":"Dual Complete TX-D007","m":16}, {"p":"AARP MA UHC TX-0042","m":15}], VA:[{"p":"Dual Complete VA-Y002","m":37}, {"p":"Dual Complete VA-Y001","m":8}, {"p":"Dual Complete VA-Q001","m":3}, {"p":"AARP MA UHC VA-0006","m":2}, {"p":"AARP MA UHC VA-0014","m":2}, {"p":"Dual Complete VA-V001","m":2}, {"p":"AARP MA UHC TC-0003","m":1}, {"p":"AARP MA UHC VA-0010","m":1}], WI:[{"p":"Dual Complete WI-D3","m":3}]},
    agents:[{n:"Viera, Jehonissi",m:745,s:"NJ",ss:["CO","FL","NC","NJ","PA","SC","TN","TX"],bs:{CO:7,FL:223,NC:119,NJ:266,PA:58,SC:11,TN:3,TX:58},agency:"Concep Care"}, {n:"Concepcion, Henry",m:740,s:"NJ",ss:["AL","CO","CT","FL","GA","MI","NJ","OH","PA","RI","TN","TX","VA","WI"],bs:{AL:20,CO:45,CT:18,FL:163,GA:15,MI:16,NJ:228,OH:65,PA:5,RI:139,TN:3,TX:5,VA:15,WI:3},agency:"Concep Care"}, {n:"Pirez Guzman, Christopher",m:524,s:"FL",ss:["CA","FL","NJ","PA","TX"],bs:{CA:12,FL:312,NJ:71,PA:1,TX:128},agency:"Concep Care"}, {n:"Vega Figueroa, Jessica",m:518,s:"NJ",ss:["CO","CT","DE","FL","NC","NJ","PA","RI","TX"],bs:{CO:4,CT:82,DE:5,FL:71,NC:45,NJ:121,PA:107,RI:30,TX:53},agency:"Concep Care"}, {n:"Rivera De Montes, Desiree",m:511,s:"NC",ss:["AL","AZ","CO","CT","DE","FL","GA","MI","NC","NJ","NY","OH","PA","PR","SC","TN","TX","VA"],bs:{AL:2,AZ:6,CO:41,CT:7,DE:16,FL:21,GA:37,MI:5,NC:147,NJ:78,NY:2,OH:33,PA:29,PR:1,SC:6,TN:17,TX:44,VA:19},agency:"Concep Care"}, {n:"Moralez, Tatiana",m:425,s:"NJ",ss:["CA","CO","CT","FL","GA","NC","NJ","PA","TX","VA"],bs:{CA:15,CO:8,CT:40,FL:46,GA:1,NC:131,NJ:144,PA:6,TX:33,VA:1},agency:"Concep Care"}, {n:"Pagan, Raul",m:394,s:"FL",ss:["CO","CT","FL","NJ","PA","RI","TX"],bs:{CO:2,CT:7,FL:274,NJ:11,PA:16,RI:8,TX:76},agency:"Concep Care"}, {n:"Calderon Monserrate, Lizmarie",m:376,s:"FL",ss:["CO","FL","NJ","PA","TX","VA"],bs:{CO:28,FL:253,NJ:3,PA:2,TX:67,VA:23},agency:"Concep Care"}, {n:"Isaac Malave, Carlos",m:245,s:"FL",ss:["CO","FL","OH","PA"],bs:{CO:1,FL:205,OH:37,PA:2},agency:"Concep Care"}, {n:"Garcia, Jesus",m:200,s:"NJ",ss:["FL","NJ","TX","VA"],bs:{FL:1,NJ:108,TX:90,VA:1},agency:"Concep Care"}, {n:"Perez Morales, Dayanisse",m:168,s:"FL",ss:["AZ","FL","NJ","TX"],bs:{AZ:4,FL:85,NJ:5,TX:74},agency:"Concep Care"}, {n:"Concep Care Insurance Agency,",m:151,s:"RI",ss:["CO","FL","NJ","OH","RI"],bs:{CO:9,FL:6,NJ:1,OH:16,RI:119},agency:"Concep Care"}, {n:"Aljijakly, Muhammed",m:104,s:"FL",ss:["FL","NC","PA"],bs:{FL:67,NC:24,PA:13},agency:"Concep Care"}, {n:"Torres Ferrer, Aida",m:96,s:"OH",ss:["FL","NJ","OH","PA"],bs:{FL:35,NJ:3,OH:55,PA:3},agency:"Concep Care"}, {n:"Cruz Rodriguez, Guillermo",m:47,s:"FL",ss:["FL","NC","NJ","PA","TX"],bs:{FL:22,NC:2,NJ:15,PA:2,TX:6},agency:"Concep Care"}, {n:"The Rivera Montes Group Llc,",m:39,s:"NC",ss:["AZ","FL","MI","NC","NJ","PA","TN"],bs:{AZ:2,FL:1,MI:3,NC:20,NJ:4,PA:7,TN:2},agency:"Concep Care"}, {n:"Bautista, Yanice",m:8,s:"NJ",ss:["NJ","RI"],bs:{NJ:7,RI:1},agency:"Concep Care"}, {n:"Young, Kelley",m:5,s:"FL",ss:["FL"],bs:{FL:5},agency:"Concep Care"}, {n:"Lopez Rivera, Jessica",m:2,s:"FL",ss:["FL"],bs:{FL:2},agency:"Concep Care"}, {n:"Bautista Mota, Carlos",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"Concep Care"}, {n:"Rodriguez, Sandra",m:1,s:"TX",ss:["TX"],bs:{TX:1},agency:"Concep Care"}],
  },
  "GW Ins Group": {
    total:1641, uniqueAgents:14,
    states:["NJ","FL","TX","PA","OH","AZ","CT","NC","VA","NY","SC","DE"],
    bobState:{AZ:{m:91,a:3}, CT:{m:65,a:3}, DE:{m:9,a:2}, FL:{m:526,a:9}, NC:{m:24,a:2}, NJ:{m:539,a:10}, NY:{m:20,a:4}, OH:{m:94,a:4}, PA:{m:103,a:6}, SC:{m:11,a:1}, TX:{m:133,a:6}, VA:{m:22,a:3}},
    aps:{AZ:3, CT:3, DE:2, FL:9, NC:2, NJ:10, NY:4, OH:4, PA:6, SC:1, TX:6, VA:3},
    monthly:{AZ:{"2024-01":1,"2025-01":20,"2025-02":6,"2025-03":7,"2025-04":3,"2025-06":1,"2025-07":7,"2025-08":5,"2025-09":6,"2025-10":2,"2025-11":5,"2025-12":3,"2026-01":17,"2026-02":4,"2026-03":2,"2026-04":1,"2026-06":1}, CT:{"2025-01":4,"2025-06":1,"2025-07":1,"2025-08":2,"2025-09":4,"2025-10":8,"2025-11":5,"2025-12":3,"2026-01":9,"2026-02":23,"2026-03":1,"2026-04":2,"2026-05":1,"2026-07":1}, DE:{"2025-01":1,"2025-07":1,"2025-11":2,"2026-01":4,"2026-03":1}, FL:{"2025-01":65,"2025-02":4,"2025-03":9,"2025-04":15,"2025-05":25,"2025-06":33,"2025-07":21,"2025-08":28,"2025-09":35,"2025-10":46,"2025-11":30,"2025-12":21,"2026-01":135,"2026-02":37,"2026-03":14,"2026-04":6,"2026-05":2}, NC:{"2025-01":16,"2025-03":3,"2025-07":1,"2026-01":1,"2026-02":2,"2026-04":1}, NJ:{"2024-07":1,"2025-01":177,"2025-02":8,"2025-03":13,"2025-04":21,"2025-05":14,"2025-06":17,"2025-07":9,"2025-08":18,"2025-09":10,"2025-10":12,"2025-11":10,"2025-12":19,"2026-01":104,"2026-02":44,"2026-03":23,"2026-04":28,"2026-05":11}, NY:{"2025-01":10,"2025-02":1,"2025-03":1,"2025-08":1,"2025-09":1,"2025-11":1,"2026-01":2,"2026-02":1,"2026-03":1,"2026-04":1}, OH:{"2025-01":7,"2025-02":2,"2025-03":1,"2025-04":1,"2025-05":3,"2025-06":3,"2025-07":1,"2025-08":2,"2025-09":2,"2025-11":21,"2025-12":24,"2026-01":21,"2026-02":6}, PA:{"2025-01":22,"2025-02":1,"2025-04":1,"2025-05":1,"2025-06":1,"2025-09":1,"2025-10":1,"2025-11":1,"2025-12":1,"2026-01":53,"2026-02":15,"2026-03":1,"2026-04":4}, SC:{"2025-01":2,"2025-05":1,"2025-06":1,"2025-07":1,"2025-08":2,"2025-12":1,"2026-03":1,"2026-04":1,"2026-05":1}, TX:{"2024-09":1,"2025-01":37,"2025-02":1,"2025-03":5,"2025-04":2,"2025-05":3,"2025-06":8,"2025-07":4,"2025-08":9,"2025-09":8,"2025-10":8,"2025-11":11,"2025-12":4,"2026-01":12,"2026-02":8,"2026-03":1,"2026-04":10,"2026-05":1}, VA:{"2025-01":5,"2025-04":1,"2025-05":1,"2025-06":2,"2025-07":2,"2025-08":2,"2025-09":4,"2025-11":2,"2026-01":2,"2026-02":1}},
    plans:{AZ:[{"p":"Dual Complete AZ-S001","m":34}, {"p":"AARP MA UHC AZ-002P","m":16}, {"p":"UHC Complete Care AZ-1P","m":9}, {"p":"AARP MA Essentials AZ-1","m":7}, {"p":"AARP MA UHC AZ-0003","m":6}, {"p":"AARP MA Essentials AZ-2","m":4}, {"p":"AARP MA Extras AZ-5","m":4}, {"p":"AARP MA UHC AZ-0008","m":3}], CT:[{"p":"Dual Complete CT-S2","m":55}, {"p":"Dual Complete CT-Q001","m":5}, {"p":"Dual Complete CT-S001","m":3}, {"p":"UHC Medicare Advantage CT-0002","m":1}, {"p":"UHC Medicare Advantage CT-0003","m":1}], DE:[{"p":"UHC Complete Care Support DE-5A","m":4}, {"p":"UHC Complete Care DE-4","m":2}, {"p":"AARP MA Essentials DE-3","m":1}, {"p":"AARP MA Extras DE-6","m":1}, {"p":"AARP MA UHC DE-0001","m":1}], FL:[{"p":"Dual Complete FL-Y5","m":172}, {"p":"Dual Complete FL-Y4","m":162}, {"p":"UHC Preferred Dual Complete FL-Y2","m":65}, {"p":"Dual Complete FL-D002","m":13}, {"p":"UHC MedicareMax Dual Complete FL-Y6","m":12}, {"p":"AARP MA UHC FL-0009","m":10}, {"p":"UHC The Villages Medicare Advantage FL-0","m":10}, {"p":"Dual Complete FL-D003","m":9}], NC:[{"p":"Dual Complete NC-S3","m":10}, {"p":"AARP MA UHC NC-0015","m":3}, {"p":"AARP MA UHC NC-0021","m":3}, {"p":"Dual Complete NC-D001","m":3}, {"p":"Dual Complete NC-S001","m":3}, {"p":"AARP MA UHC NC-0016","m":1}, {"p":"AARP MA UHC NC-26","m":1}], NJ:[{"p":"AARP MA UHC NJ-0005","m":214}, {"p":"Dual Complete NJ-Y001","m":181}, {"p":"AARP MA Extras NJ-7","m":93}, {"p":"AARP MA Essentials NJ-1","m":37}, {"p":"AARP MA UHC NJ-6","m":7}, {"p":"AARP MA UHC NJ-0004","m":4}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":2}, {"p":"AARP MA UHC NJ-0003","m":1}], NY:[{"p":"AARP MA UHC NY-0013","m":6}, {"p":"Dual Complete NY-S002","m":5}, {"p":"AARP MA UHC NY-34","m":4}, {"p":"AARP MA UHC NY-0012","m":2}, {"p":"Dual Complete NY-Q001","m":2}, {"p":"AARP MA UHC NY-0007","m":1}], OH:[{"p":"Dual Complete OH-S3","m":54}, {"p":"Dual Complete OH-S2","m":19}, {"p":"Dual Complete OH-D001","m":9}, {"p":"UHC Complete Care OH-18","m":5}, {"p":"Dual Complete OH-D002","m":3}, {"p":"AARP MA Extras OH-11","m":2}, {"p":"AARP MA Extras OH-10","m":1}, {"p":"AARP MA Extras OH-9","m":1}], PA:[{"p":"Dual Complete PA-S3","m":75}, {"p":"AARP MA UHC PA-0007","m":7}, {"p":"Dual Complete PA-S002","m":7}, {"p":"UHC Complete Care PA-17","m":6}, {"p":"AARP MA Extras PA-18","m":2}, {"p":"AARP MA UHC PA-0008","m":2}, {"p":"Dual Complete PA-S001","m":2}, {"p":"AARP MA UHC PA-0001","m":1}], SC:[{"p":"UHC Complete Care Support SC-7","m":6}, {"p":"UHC Complete Care SC-1","m":2}, {"p":"AARP MA UHC SC-0006","m":1}, {"p":"Dual Complete SC-S001","m":1}, {"p":"Dual Complete SC-S2","m":1}], TX:[{"p":"Dual Complete TX-S003","m":84}, {"p":"Dual Complete TX-S5","m":6}, {"p":"AARP MA UHC TX-4P","m":5}, {"p":"AARP Medicare Advantage CareFlex from UH","m":3}, {"p":"AARP MA Extras TX-27","m":3}, {"p":"AARP MA UHC TX-001P","m":3}, {"p":"UHC Complete Care TX-19","m":3}, {"p":"UHC Complete Care TX-3P","m":3}], VA:[{"p":"Dual Complete VA-Y002","m":8}, {"p":"AARP MA UHC VA-0014","m":4}, {"p":"Dual Complete VA-Q001","m":3}, {"p":"AARP MA UHC VA-0010","m":2}, {"p":"Dual Complete VA-Y001","m":2}, {"p":"Dual Complete VA-Y3","m":2}, {"p":"Dual Complete VA-Y4","m":1}]},
    agents:[{n:"Colon, Glenda",m:543,s:"FL",ss:["FL","NC","NJ","NY","OH","PA","TX","VA"],bs:{FL:216,NC:2,NJ:199,NY:16,OH:47,PA:58,TX:3,VA:2},agency:"GW Ins Group"}, {n:"Rodriguez Benitez, Alison",m:432,s:"NJ",ss:["AZ","CT","DE","FL","NC","NJ","NY","OH","PA","PR","SC","TX","VA"],bs:{AZ:88,CT:13,DE:8,FL:38,NC:22,NJ:129,NY:3,OH:31,PA:25,PR:2,SC:11,TX:56,VA:6},agency:"GW Ins Group"}, {n:"De Los Angeles, Johnny",m:231,s:"FL",ss:["CT","DE","FL","NJ","NY","PA"],bs:{CT:53,DE:1,FL:113,NJ:59,NY:4,PA:1},agency:"GW Ins Group"}, {n:"Colon, Carlos",m:223,s:"FL",ss:["AZ","FL","NJ","OH","PA","TX"],bs:{AZ:3,FL:138,NJ:17,OH:6,PA:1,TX:58},agency:"GW Ins Group"}, {n:"Balgobin, Iris",m:188,s:"NJ",ss:["AZ","FL","NJ","PA","TX","VA"],bs:{AZ:1,FL:32,NJ:129,PA:5,TX:3,VA:18},agency:"GW Ins Group"}, {n:"Miranda Rivera, Fabiola",m:53,s:"FL",ss:["FL","NJ","PA","TX"],bs:{FL:24,NJ:6,PA:13,TX:10},agency:"GW Ins Group"}, {n:"Barry, Christopher",m:51,s:"NJ",ss:["NJ"],bs:{NJ:51},agency:"GW Ins Group"}, {n:"Bartolomey Cotto, Jose",m:31,s:"FL",ss:["CT","FL","OH","TX"],bs:{CT:2,FL:13,OH:11,TX:5},agency:"GW Ins Group"}, {n:"Sinigaglia Lopez, Livia",m:13,s:"FL",ss:["FL"],bs:{FL:13},agency:"GW Ins Group"}, {n:"Gamboa, Marilyn",m:3,s:"FL",ss:["FL"],bs:{FL:3},agency:"GW Ins Group"}, {n:"Precise Insurance Brokerage Llc",m:2,s:"NY",ss:["NY"],bs:{NY:2},agency:"GW Ins Group"}, {n:"Rodriguez Cuevas, Yemili",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"GW Ins Group"}],
  },
  "Simarova Senior": {
    total:1614, uniqueAgents:9,
    states:["TX","FL","CO","NC","RI","PA","OH","CT","NJ","MI","LA","WI","VA","AZ"],
    bobState:{AZ:{m:2,a:1}, CO:{m:188,a:6}, CT:{m:19,a:2}, FL:{m:418,a:7}, LA:{m:6,a:1}, MI:{m:12,a:3}, NC:{m:154,a:5}, NJ:{m:12,a:4}, OH:{m:70,a:4}, PA:{m:95,a:5}, RI:{m:99,a:4}, TX:{m:529,a:8}, VA:{m:2,a:2}, WI:{m:3,a:1}},
    aps:{AZ:1, CO:6, CT:2, FL:7, LA:1, MI:3, NC:5, NJ:4, OH:4, PA:5, RI:4, TX:8, VA:2, WI:1},
    monthly:{AZ:{"2026-01":2}, CO:{"2025-01":12,"2025-03":1,"2025-04":3,"2025-05":3,"2025-06":2,"2025-07":1,"2025-09":12,"2025-10":24,"2025-11":4,"2025-12":1,"2026-01":86,"2026-02":32,"2026-03":5,"2026-04":2}, CT:{"2025-01":6,"2025-08":1,"2025-09":4,"2025-10":3,"2026-01":2,"2026-02":3}, FL:{"2025-01":58,"2025-02":1,"2025-03":7,"2025-04":19,"2025-05":58,"2025-06":58,"2025-07":26,"2025-08":33,"2025-09":29,"2025-10":31,"2025-11":12,"2025-12":6,"2026-01":55,"2026-02":11,"2026-03":4,"2026-04":8,"2026-05":2}, LA:{"2026-03":1,"2026-04":5}, MI:{"2025-01":2,"2025-03":2,"2025-05":1,"2025-07":1,"2025-08":1,"2026-01":5}, NC:{"2025-01":5,"2025-03":3,"2025-04":8,"2025-05":9,"2025-06":23,"2025-07":5,"2025-08":1,"2025-09":5,"2025-10":2,"2025-11":1,"2026-01":50,"2026-02":27,"2026-03":1,"2026-04":13,"2026-05":1}, NJ:{"2025-02":1,"2025-05":2,"2025-06":2,"2025-10":1,"2026-03":2,"2026-04":4}, OH:{"2025-01":5,"2025-06":1,"2025-08":1,"2025-09":1,"2026-01":20,"2026-02":35,"2026-03":5,"2026-05":2}, PA:{"2025-01":10,"2025-02":3,"2025-04":4,"2025-05":8,"2025-06":14,"2025-07":4,"2025-08":6,"2025-09":6,"2025-10":5,"2025-11":2,"2025-12":2,"2026-01":22,"2026-02":5,"2026-04":3,"2026-05":1}, RI:{"2025-01":1,"2025-09":1,"2025-11":1,"2026-01":66,"2026-02":12,"2026-03":5,"2026-04":11,"2026-05":2}, TX:{"2024-01":1,"2025-01":38,"2025-02":6,"2025-03":3,"2025-04":40,"2025-05":43,"2025-06":31,"2025-07":15,"2025-08":27,"2025-09":53,"2025-10":25,"2025-11":7,"2025-12":4,"2026-01":150,"2026-02":38,"2026-03":26,"2026-04":21,"2026-05":1}, VA:{"2025-04":1,"2026-01":1}, WI:{"2026-02":3}},
    plans:{AZ:[{"p":"AARP MA UHC AZ-002P","m":2}], CO:[{"p":"Dual Complete CO-S4","m":180}, {"p":"Dual Complete CO-S002","m":7}, {"p":"UHC Complete Care CO-1P","m":1}], CT:[{"p":"Dual Complete CT-S2","m":15}, {"p":"Dual Complete CT-S001","m":4}], FL:[{"p":"Dual Complete FL-Y5","m":373}, {"p":"Dual Complete FL-Y4","m":20}, {"p":"AARP MA UHC FL-0006","m":6}, {"p":"UHC Preferred Dual Complete FL-Y2","m":6}, {"p":"Dual Complete FL-D003","m":4}, {"p":"AARP MA UHC FL-0009","m":3}, {"p":"Dual Complete FL-D002","m":3}, {"p":"AARP MA UHC FL-0010","m":1}], LA:[{"p":"Peoples Health Dual Complete LA-S5","m":5}, {"p":"Dual Complete LA-S001","m":1}], MI:[{"p":"Dual Complete MI-S3","m":7}, {"p":"Dual Complete MI-Y1","m":4}, {"p":"Dual Complete MI-S002","m":1}], NC:[{"p":"Dual Complete NC-S3","m":149}, {"p":"AARP MA UHC NC-0015","m":1}, {"p":"AARP MA UHC NC-24","m":1}, {"p":"AARP MA UHC NC-26","m":1}, {"p":"Dual Complete NC-D001","m":1}, {"p":"Dual Complete NC-S2","m":1}], NJ:[{"p":"Dual Complete NJ-Y001","m":9}, {"p":"AARP MA Extras NJ-7","m":1}, {"p":"AARP MA UHC NJ-0005","m":1}, {"p":"AARP MA UHC NJ-6","m":1}], OH:[{"p":"Dual Complete OH-S3","m":34}, {"p":"Dual Complete OH-S2","m":17}, {"p":"AARP MA Extras OH-10","m":4}, {"p":"AARP MA UHC OH-18","m":4}, {"p":"AARP MA Extras OH-9","m":3}, {"p":"AARP MA Essentials OH-5","m":2}, {"p":"UHC Complete Care OH-18","m":2}, {"p":"Dual Complete OH-D002","m":2}], PA:[{"p":"Dual Complete PA-S3","m":74}, {"p":"AARP MA UHC PA-0011","m":10}, {"p":"Dual Complete PA-S002","m":8}, {"p":"AARP MA Essentials PA-5","m":1}, {"p":"AARP MA UHC PA-0002","m":1}, {"p":"AARP MA UHC PA-0003","m":1}], RI:[{"p":"Dual Complete RI-S3","m":99}], TX:[{"p":"Dual Complete TX-S003","m":508}, {"p":"Dual Complete TX-Y1","m":12}, {"p":"Dual Complete TX-S4","m":4}, {"p":"Dual Complete TX-D002","m":2}, {"p":"AARP MA Extras TX-28","m":1}, {"p":"AARP MA UHC TX-001P","m":1}, {"p":"Dual Complete TX-S5","m":1}], VA:[{"p":"Dual Complete VA-Y001","m":1}, {"p":"Dual Complete VA-Y002","m":1}], WI:[{"p":"Dual Complete WI-D3","m":2}, {"p":"Dual Complete WI-D002","m":1}]},
    agents:[{n:"Lopez-aguilar, Ramon",m:514,s:"TX",ss:["CO","FL","MI","NC","NJ","RI","TX"],bs:{CO:24,FL:175,MI:1,NC:107,NJ:2,RI:3,TX:202},agency:"Simarova Senior"}, {n:"Simarova, Nikol",m:319,s:"CO",ss:["CO","CT","FL","MI","NC","NJ","OH","PA","RI","TX","VA","WI"],bs:{CO:94,CT:17,FL:21,MI:7,NC:4,NJ:83,OH:11,PA:20,RI:53,TX:4,VA:2,WI:3},agency:"Simarova Senior"}, {n:"Lopez Caro, Kimberly",m:306,s:"TX",ss:["CO","FL","MI","NC","NJ","OH","PA","TX","VA"],bs:{CO:41,FL:33,MI:2,NC:19,NJ:5,OH:49,PA:6,TX:150,VA:1},agency:"Simarova Senior"}, {n:"Fialkowski-jaraczewski, Drew",m:231,s:"TX",ss:["CO","CT","FL","OH","RI","TX"],bs:{CO:27,CT:2,FL:36,OH:7,RI:42,TX:117},agency:"Simarova Senior"}, {n:"Rodriguez, Sara",m:127,s:"FL",ss:["FL","MI","NJ","OH","PA","TX"],bs:{FL:87,MI:4,NJ:2,OH:2,PA:9,TX:23},agency:"Simarova Senior"}, {n:"Rivera Prentice, Tomas",m:87,s:"PA",ss:["AZ","NC","PA","TX"],bs:{AZ:2,NC:24,PA:59,TX:2},agency:"Simarova Senior"}, {n:"Lopez, Nelson",m:74,s:"FL",ss:["FL"],bs:{FL:74},agency:"Simarova Senior"}, {n:"Garcia Skerrett, Nestor",m:48,s:"TX",ss:["CO","LA","TX"],bs:{CO:1,LA:17,TX:30},agency:"Simarova Senior"}, {n:"Simarova Senior Solutions Llc Dba Simarova Senior Insurance Solutions",m:13,s:"RI",ss:["CO","FL","NC","PA","RI","TX"],bs:{CO:2,FL:3,NC:1,PA:2,RI:4,TX:1},agency:"Simarova Senior"}],
  },
  "KMRA Group": {
    total:1132, uniqueAgents:10,
    states:["PA","NJ","TX","FL"],
    bobState:{FL:{m:8,a:3}, NJ:{m:441,a:7}, PA:{m:655,a:8}, TX:{m:26,a:1}},
    aps:{FL:3, NJ:7, PA:8, TX:1},
    monthly:{FL:{"2025-07":1,"2025-11":1,"2026-01":4,"2026-02":2}, NJ:{"2025-01":182,"2025-02":12,"2025-03":12,"2025-04":14,"2025-05":10,"2025-06":19,"2025-07":9,"2025-08":15,"2025-09":29,"2025-10":5,"2025-11":12,"2025-12":10,"2026-01":73,"2026-02":6,"2026-03":9,"2026-04":18,"2026-05":6}, PA:{"2025-01":39,"2025-02":3,"2025-03":4,"2025-04":5,"2025-05":6,"2025-06":31,"2025-07":7,"2025-08":12,"2025-09":30,"2025-10":42,"2025-11":76,"2025-12":44,"2026-01":220,"2026-02":74,"2026-03":33,"2026-04":28,"2026-05":1}, TX:{"2025-03":1,"2025-04":1,"2025-05":3,"2025-06":2,"2025-07":1,"2025-09":4,"2025-10":6,"2025-11":2,"2026-01":3,"2026-02":3}},
    plans:{FL:[{"p":"UHC Complete Care FL-14","m":2}, {"p":"Dual Complete FL-Y4","m":2}, {"p":"AARP Medicare Advantage CareFlex from UH","m":1}, {"p":"AARP MA UHC FL-0016","m":1}, {"p":"AARP MA UHC FL-0017","m":1}, {"p":"Dual Complete FL-D003","m":1}], NJ:[{"p":"Dual Complete NJ-Y001","m":221}, {"p":"AARP MA UHC NJ-0005","m":112}, {"p":"AARP MA Extras NJ-7","m":46}, {"p":"AARP MA Essentials NJ-1","m":38}, {"p":"AARP MA UHC NJ-6","m":13}, {"p":"AARP MA UHC NJ-0004","m":6}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":4}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":1}], PA:[{"p":"Dual Complete PA-S3","m":627}, {"p":"Dual Complete PA-S002","m":10}, {"p":"UHC Complete Care PA-17","m":5}, {"p":"AARP MA UHC PA-0002","m":4}, {"p":"Dual Complete PA-S001","m":3}, {"p":"AARP MA Extras PA-18","m":2}, {"p":"AARP MA UHC PA-0011","m":2}, {"p":"AARP MA UHC PA-0001","m":1}], TX:[{"p":"Dual Complete TX-S003","m":20}, {"p":"Dual Complete TX-S4","m":5}, {"p":"Dual Complete TX-Y1","m":1}]},
    agents:[{n:"Gibbs, Brittany",m:459,s:"PA",ss:["NJ","NY","PA"],bs:{NJ:208,NY:1,PA:250},agency:"KMRA Group"}, {n:"Legacy Care Agency L.l.c.",m:357,s:"PA",ss:["FL","NJ","PA"],bs:{FL:4,NJ:13,PA:340},agency:"KMRA Group"}, {n:"Pinzon, Roland",m:107,s:"NJ",ss:["FL","NJ","PA"],bs:{FL:1,NJ:64,PA:42},agency:"KMRA Group"}, {n:"Reyes, Olga",m:99,s:"NJ",ss:["NJ"],bs:{NJ:99},agency:"KMRA Group"}, {n:"Kmra Group, Llc",m:69,s:"NJ",ss:["FL","NJ","PA"],bs:{FL:2,NJ:65,PA:2},agency:"KMRA Group"}, {n:"Rodriguez, Mayra",m:39,s:"TX",ss:["FL","PA","TX"],bs:{FL:3,PA:10,TX:26},agency:"KMRA Group"}, {n:"Ortiz, Amanda",m:10,s:"PA",ss:["PA"],bs:{PA:10},agency:"KMRA Group"}, {n:"Acosta, Melissa",m:6,s:"PA",ss:["NJ","PA"],bs:{NJ:1,PA:5},agency:"KMRA Group"}, {n:"Landaverde, Jessenia",m:2,s:"PA",ss:["PA"],bs:{PA:2},agency:"KMRA Group"}, {n:"Sanchez, Samir",m:2,s:"NJ",ss:["NJ"],bs:{NJ:2},agency:"KMRA Group"}, {n:"Tanksley, Tammy",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"KMRA Group"}],
  },
  "Martell Multi": {
    total:1031, uniqueAgents:10,
    states:["NJ","PA","TX","NY"],
    bobState:{NJ:{m:472,a:10}, NY:{m:1,a:1}, PA:{m:395,a:3}, TX:{m:160,a:2}},
    aps:{NJ:10, NY:1, PA:3, TX:2},
    monthly:{NJ:{"2024-03":1,"2024-07":1,"2025-01":84,"2025-02":14,"2025-03":47,"2025-04":40,"2025-05":8,"2025-06":11,"2025-07":8,"2025-08":15,"2025-09":20,"2025-10":11,"2025-11":16,"2025-12":11,"2026-01":122,"2026-02":23,"2026-03":19,"2026-04":17,"2026-05":4}, NY:{"2026-02":1}, PA:{"2025-01":26,"2025-02":3,"2025-03":3,"2025-04":9,"2025-05":1,"2025-06":2,"2025-07":3,"2025-08":5,"2025-09":1,"2025-10":24,"2025-11":33,"2025-12":45,"2026-01":173,"2026-02":32,"2026-03":20,"2026-04":14,"2026-05":1}, TX:{"2025-01":26,"2025-02":2,"2025-03":2,"2025-05":26,"2025-06":39,"2025-07":11,"2025-08":14,"2025-09":17,"2025-10":5,"2025-11":1,"2026-01":14,"2026-02":3}},
    plans:{NJ:[{"p":"AARP MA Extras NJ-7","m":181}, {"p":"AARP MA UHC NJ-0005","m":108}, {"p":"Dual Complete NJ-Y001","m":102}, {"p":"AARP MA UHC NJ-6","m":67}, {"p":"AARP MA Essentials NJ-1","m":9}, {"p":"AARP MA UHC NJ-0004","m":3}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":1}, {"p":"AARP MA UHC NJ-0003","m":1}], NY:[{"p":"AARP MA UHC NY-34","m":1}], PA:[{"p":"Dual Complete PA-S3","m":390}, {"p":"Dual Complete PA-S001","m":2}, {"p":"AARP MA UHC PA-0002","m":1}, {"p":"AARP MA UHC PA-0010","m":1}, {"p":"UHC Complete Care PA-17","m":1}], TX:[{"p":"Dual Complete TX-S003","m":154}, {"p":"Dual Complete TX-S4","m":3}, {"p":"AARP MA Extras TX-28","m":1}, {"p":"AARP Medicare Advantage Giveback from UH","m":1}, {"p":"Dual Complete TX-D004","m":1}]},
    agents:[{n:"Fernandez, Jose",m:627,s:"PA",ss:["NJ","PA","TX"],bs:{NJ:194,PA:273,TX:160},agency:"Martell Multi"}, {n:"Uribe, Gisela",m:128,s:"NJ",ss:["FL","NJ","NY"],bs:{FL:1,NJ:126,NY:1},agency:"Martell Multi"}, {n:"Martell, Ana",m:127,s:"NJ",ss:["GA","NJ","PA","TX"],bs:{GA:1,NJ:98,PA:27,TX:1},agency:"Martell Multi"}, {n:"Padilla, Julissa",m:116,s:"PA",ss:["NJ","PA"],bs:{NJ:16,PA:100},agency:"Martell Multi"}, {n:"Brito Uribe, Gabriela",m:11,s:"NJ",ss:["NJ"],bs:{NJ:11},agency:"Martell Multi"}, {n:"Abbott, Gale",m:9,s:"NJ",ss:["NJ"],bs:{NJ:9},agency:"Martell Multi"}, {n:"Martell Multi Service Llc",m:9,s:"NJ",ss:["NJ"],bs:{NJ:9},agency:"Martell Multi"}, {n:"Polanco, Maribel",m:4,s:"NJ",ss:["NJ"],bs:{NJ:4},agency:"Martell Multi"}, {n:"Ramirez, Sergio",m:2,s:"NJ",ss:["NJ"],bs:{NJ:2},agency:"Martell Multi"}],
  },
  "TCS & Associates": {
    total:977, uniqueAgents:14,
    states:["TX","FL","NC","NJ","LA"],
    bobState:{FL:{m:318,a:6}, LA:{m:13,a:2}, NC:{m:59,a:2}, NJ:{m:31,a:5}, TX:{m:553,a:12}},
    aps:{FL:6, LA:2, NC:2, NJ:5, TX:12},
    monthly:{FL:{"2025-01":40,"2025-02":2,"2025-03":3,"2025-04":21,"2025-05":25,"2025-06":43,"2025-07":24,"2025-08":5,"2025-09":17,"2025-10":26,"2025-11":15,"2025-12":2,"2026-01":69,"2026-02":21,"2026-03":3,"2026-04":1,"2026-05":1}, LA:{"2026-02":12,"2026-04":1}, NC:{"2025-01":2,"2025-02":1,"2025-04":1,"2025-05":1,"2025-06":12,"2025-07":1,"2025-08":1,"2025-09":2,"2025-10":1,"2026-01":16,"2026-02":19,"2026-04":2}, NJ:{"2025-01":9,"2025-04":2,"2025-05":1,"2025-09":2,"2025-10":1,"2026-01":5,"2026-02":4,"2026-03":5,"2026-04":2}, TX:{"2024-07":1,"2024-08":1,"2024-09":2,"2024-11":2,"2025-01":48,"2025-02":6,"2025-03":9,"2025-04":24,"2025-05":30,"2025-06":41,"2025-07":18,"2025-08":32,"2025-09":22,"2025-10":21,"2025-11":26,"2025-12":3,"2026-01":204,"2026-02":34,"2026-03":12,"2026-04":14,"2026-05":3}},
    plans:{FL:[{"p":"Dual Complete FL-Y5","m":133}, {"p":"Dual Complete FL-Y4","m":71}, {"p":"UHC Preferred Dual Complete FL-Y2","m":34}, {"p":"Dual Complete FL-D002","m":17}, {"p":"Dual Complete FL-D006","m":15}, {"p":"UHC Preferred Dual Complete FL-D001","m":9}, {"p":"UHC MedicareMax Dual Complete FL-Y6","m":8}, {"p":"Dual Complete FL-D003","m":7}], LA:[{"p":"Peoples Health Dual Complete LA-S5","m":12}, {"p":"Dual Complete LA-S003","m":1}], NC:[{"p":"Dual Complete NC-S3","m":44}, {"p":"UHC Complete Care NC-28","m":11}, {"p":"AARP MA UHC NC-0015","m":1}, {"p":"AARP MA UHC NC-0021","m":1}, {"p":"AARP MA UHC NC-26","m":1}, {"p":"Dual Complete NC-D001","m":1}], NJ:[{"p":"AARP MA Extras NJ-7","m":20}, {"p":"Dual Complete NJ-Y001","m":7}, {"p":"AARP MA UHC NJ-0005","m":2}, {"p":"AARP MA Essentials NJ-1","m":1}, {"p":"AARP MA UHC NJ-6","m":1}], TX:[{"p":"Dual Complete TX-S003","m":255}, {"p":"Dual Complete TX-Y1","m":200}, {"p":"UHC Complete Care TX-24","m":25}, {"p":"AARP MA Extras TX-28","m":19}, {"p":"AARP MA UHC TX-001P","m":6}, {"p":"Dual Complete TX-D004","m":6}, {"p":"Dual Complete TX-S4","m":6}, {"p":"AARP MA Essentials TX-21","m":5}]},
    agents:[{n:"Clark, Sara",m:564,s:"TX",ss:["FL","LA","NC","NJ","TX"],bs:{FL:2,LA:2,NC:35,NJ:41,TX:484},agency:"TCS & Associates"}, {n:"Molina Lopez, Sergio",m:126,s:"FL",ss:["FL","TX"],bs:{FL:121,TX:5},agency:"TCS & Associates"}, {n:"King, Dawne",m:104,s:"FL",ss:["FL","NJ","TX"],bs:{FL:81,NJ:3,TX:20},agency:"TCS & Associates"}, {n:"Moreno De Molina, Rosa",m:87,s:"FL",ss:["FL","TX"],bs:{FL:60,TX:27},agency:"TCS & Associates"}, {n:"Mazzoncini, Pablo",m:65,s:"FL",ss:["FL","TX"],bs:{FL:53,TX:12},agency:"TCS & Associates"}, {n:"Castillo, Destiny",m:59,s:"TX",ss:["NJ","TX"],bs:{NJ:5,TX:54},agency:"TCS & Associates"}, {n:"Granger, Desiree",m:57,s:"TX",ss:["LA","TX"],bs:{LA:11,TX:46},agency:"TCS & Associates"}, {n:"Hoover, Theron",m:45,s:"TX",ss:["NJ","TX"],bs:{NJ:1,TX:44},agency:"TCS & Associates"}, {n:"Clark, Joshua",m:38,s:"TX",ss:["NJ","TX"],bs:{NJ:6,TX:32},agency:"TCS & Associates"}, {n:"Castillo, Lisa",m:32,s:"TX",ss:["TX"],bs:{TX:32},agency:"TCS & Associates"}, {n:"Wilds, China",m:24,s:"NC",ss:["NC"],bs:{NC:24},agency:"TCS & Associates"}, {n:"Alexander, Melissa",m:10,s:"TX",ss:["TX"],bs:{TX:10},agency:"TCS & Associates"}, {n:"Tcs & Associates Llc",m:8,s:"TX",ss:["TX"],bs:{TX:8},agency:"TCS & Associates"}, {n:"Cole, Matina",m:2,s:"FL",ss:["FL"],bs:{FL:2},agency:"TCS & Associates"}],
  },
  "AMC Care Group": {
    total:730, uniqueAgents:4,
    states:["TX","NC","PA","CO","CT","MI","NY","OH","SC","LA","NJ","FL","CA"],
    bobState:{CA:{m:2,a:2}, CO:{m:35,a:1}, CT:{m:30,a:1}, FL:{m:4,a:1}, LA:{m:9,a:1}, MI:{m:21,a:1}, NC:{m:206,a:2}, NJ:{m:6,a:3}, NY:{m:16,a:2}, OH:{m:11,a:1}, PA:{m:42,a:2}, SC:{m:10,a:1}, TX:{m:337,a:4}},
    aps:{CA:2, CO:1, CT:1, FL:1, LA:1, MI:1, NC:2, NJ:3, NY:2, OH:1, PA:2, SC:1, TX:4},
    monthly:{CA:{"2024-09":1,"2025-10":1}, CO:{"2025-11":4,"2025-12":5,"2026-01":16,"2026-02":10}, CT:{"2025-02":1,"2025-05":2,"2025-06":3,"2025-07":1,"2025-08":1,"2025-09":4,"2025-10":7,"2025-11":3,"2026-01":6,"2026-03":2}, FL:{"2025-01":1,"2025-05":3}, LA:{"2025-01":1,"2025-09":1,"2025-11":1,"2026-01":4,"2026-02":1,"2026-03":1}, MI:{"2025-01":2,"2025-05":1,"2025-07":1,"2025-08":4,"2025-09":5,"2025-11":2,"2026-01":5,"2026-02":1}, NC:{"2024-07":2,"2025-01":25,"2025-02":1,"2025-03":3,"2025-04":4,"2025-05":15,"2025-06":12,"2025-07":8,"2025-08":7,"2025-09":25,"2025-10":11,"2025-11":19,"2025-12":6,"2026-01":43,"2026-02":9,"2026-03":6,"2026-04":5,"2026-05":5}, NJ:{"2025-01":2,"2025-07":1,"2025-08":1,"2026-01":2}, NY:{"2025-01":3,"2025-03":1,"2025-05":1,"2025-06":1,"2025-09":6,"2026-01":4}, OH:{"2025-01":2,"2025-07":2,"2025-08":1,"2025-11":3,"2026-01":3}, PA:{"2025-01":3,"2025-05":3,"2025-06":3,"2025-07":1,"2025-08":1,"2025-09":1,"2025-10":6,"2025-11":7,"2025-12":4,"2026-01":9,"2026-02":1,"2026-03":2,"2026-05":1}, SC:{"2024-11":1,"2025-01":3,"2026-01":3,"2026-03":3}, TX:{"2024-01":1,"2024-02":1,"2025-01":35,"2025-02":5,"2025-03":2,"2025-04":4,"2025-05":3,"2025-06":4,"2025-07":3,"2025-08":22,"2025-09":22,"2025-10":47,"2025-11":16,"2025-12":4,"2026-01":143,"2026-02":12,"2026-03":3,"2026-04":8,"2026-05":2}},
    plans:{CA:[{"p":"AARP MA UHC CA-004P","m":1}, {"p":"AARP MA UHC CA-44","m":1}], CO:[{"p":"Dual Complete CO-S4","m":32}, {"p":"Dual Complete CO-S002","m":2}, {"p":"AARP MA Extras CO-5","m":1}], CT:[{"p":"Dual Complete CT-Q001","m":14}, {"p":"UHC Medicare Advantage CT-0002","m":5}, {"p":"Dual Complete CT-S001","m":4}, {"p":"Dual Complete CT-S2","m":4}, {"p":"UHC Medicare Advantage CT-0003","m":3}], FL:[{"p":"UHC Complete Care FL-14","m":2}, {"p":"Dual Complete FL-D002","m":1}, {"p":"Dual Complete FL-Y5","m":1}], LA:[{"p":"Peoples Health Dual Complete LA-S5","m":4}, {"p":"Peoples Health Secure Complete","m":3}, {"p":"Peoples Health Complete Care LA-6","m":1}, {"p":"Dual Complete LA-S4","m":1}], MI:[{"p":"Dual Complete MI-S3","m":18}, {"p":"Dual Complete MI-Y1","m":2}, {"p":"Dual Complete MI-S002","m":1}], NC:[{"p":"Dual Complete NC-S3","m":165}, {"p":"AARP MA UHC NC-0015","m":18}, {"p":"Dual Complete NC-D001","m":13}, {"p":"Dual Complete NC-S001","m":3}, {"p":"AARP MA UHC NC-0021","m":2}, {"p":"AARP MA UHC NC-26","m":2}, {"p":"UHC Complete Care NC-28","m":2}, {"p":"AARP MA UHC NC-24","m":1}], NJ:[{"p":"AARP MA Extras NJ-7","m":2}, {"p":"AARP MA UHC NJ-0005","m":2}, {"p":"Dual Complete NJ-Y001","m":2}], NY:[{"p":"Dual Complete NY-S002","m":12}, {"p":"Dual Complete NY-S001","m":3}, {"p":"UHC Complete Care NY-30","m":1}], OH:[{"p":"Dual Complete OH-S2","m":6}, {"p":"Dual Complete OH-D001","m":2}, {"p":"Dual Complete OH-S3","m":2}, {"p":"AARP MA UHC OH-18","m":1}], PA:[{"p":"Dual Complete PA-S3","m":32}, {"p":"Dual Complete PA-S002","m":6}, {"p":"AARP Medicare Advantage Giveback from UH","m":1}, {"p":"AARP MA UHC PA-0002","m":1}, {"p":"UHC Complete Care PA-17","m":1}, {"p":"Dual Complete PA-S001","m":1}], SC:[{"p":"Dual Complete SC-S001","m":3}, {"p":"AARP Medicare Advantage Patriot No Rx SC","m":2}, {"p":"UHC Complete Care SC-1","m":2}, {"p":"Dual Complete SC-S2","m":2}, {"p":"AARP MA UHC SC-0006","m":1}], TX:[{"p":"Dual Complete TX-S003","m":199}, {"p":"Dual Complete TX-S5","m":71}, {"p":"Dual Complete TX-S4","m":14}, {"p":"UHC Complete Care TX-3P","m":8}, {"p":"AARP MA Essentials TX-12","m":7}, {"p":"Dual Complete TX-D007","m":6}, {"p":"UHC Complete Care TX-19","m":4}, {"p":"Dual Complete TX-Q2","m":4}]},
    agents:[{n:"Pagan Perez, Keylin",m:197,s:"TX",ss:["NJ","TX"],bs:{NJ:1,TX:196},agency:"AMC Care Group"}, {n:"Cruz Nunez, Emanuel",m:155,s:"TX",ss:["MI","NC","NY","TX"],bs:{MI:22,NC:6,NY:14,TX:113},agency:"AMC Care Group"}],
  },
  "Top Tier Health": {
    total:356, uniqueAgents:6,
    states:["NY","NJ","DE"],
    bobState:{DE:{m:13,a:2}, NJ:{m:155,a:5}, NY:{m:188,a:6}},
    aps:{DE:2, NJ:5, NY:6},
    monthly:{DE:{"2026-01":13}, NJ:{"2025-01":39,"2025-02":1,"2025-03":5,"2025-04":7,"2025-05":6,"2025-06":14,"2025-07":20,"2025-08":11,"2025-09":11,"2025-10":3,"2025-11":2,"2026-01":21,"2026-02":7,"2026-03":5,"2026-04":3}, NY:{"2025-01":43,"2025-02":5,"2025-03":3,"2025-04":2,"2025-05":3,"2025-06":2,"2025-07":10,"2025-08":1,"2025-09":9,"2025-10":2,"2025-12":1,"2026-01":80,"2026-02":20,"2026-03":3,"2026-04":4}},
    plans:{DE:[{"p":"UHC Complete Care Support DE-5A","m":6}, {"p":"AARP MA UHC DE-0002","m":3}, {"p":"UHC Complete Care DE-4","m":3}, {"p":"AARP MA Extras DE-6","m":1}], NJ:[{"p":"AARP MA UHC NJ-0005","m":81}, {"p":"Dual Complete NJ-Y001","m":30}, {"p":"AARP MA Extras NJ-7","m":28}, {"p":"AARP MA UHC NJ-6","m":7}, {"p":"AARP MA Essentials NJ-1","m":6}, {"p":"AARP MA UHC NJ-0004","m":3}], NY:[{"p":"AARP Medicare Advantage Patriot No Rx NY","m":66}, {"p":"AARP MA UHC NY-0005","m":52}, {"p":"AARP MA UHC NY-29","m":25}, {"p":"AARP MA UHC NY-0006","m":16}, {"p":"Dual Complete NY-S002","m":10}, {"p":"AARP MA UHC NY-0012","m":6}, {"p":"Dual Complete NY-S001","m":4}, {"p":"AARP MA UHC NY-0015","m":3}]},
    agents:[{n:"Rodriguez, Jocelyn",m:199,s:"NY",ss:["DE","FL","NJ","NY"],bs:{DE:1,FL:41,NJ:67,NY:90},agency:"Top Tier Health"}, {n:"Munoz, Joshua",m:184,s:"NY",ss:["DE","FL","NJ","NY","PR"],bs:{DE:15,FL:5,NJ:70,NY:93,PR:1},agency:"Top Tier Health"}, {n:"Rodriguez, Alice",m:11,s:"NY",ss:["NJ","NY"],bs:{NJ:3,NY:8},agency:"Top Tier Health"}, {n:"Munoz, Danilo",m:8,s:"NJ",ss:["NJ","NY"],bs:{NJ:7,NY:1},agency:"Top Tier Health"}, {n:"Dieuveuille, Gina",m:2,s:"NY",ss:["NY"],bs:{NY:2},agency:"Top Tier Health"}],
  },
  "JPM Solutions": {
    total:193, uniqueAgents:4,
    states:["NJ","PA","TX","FL","AL","NY","DE"],
    bobState:{AL:{m:12,a:2}, DE:{m:2,a:1}, FL:{m:13,a:2}, NJ:{m:63,a:3}, NY:{m:10,a:1}, PA:{m:60,a:1}, TX:{m:33,a:2}},
    aps:{AL:2, DE:1, FL:2, NJ:3, NY:1, PA:1, TX:2},
    monthly:{AL:{"2025-01":1,"2025-11":1,"2026-01":8,"2026-02":1,"2026-03":1}, DE:{"2026-01":2}, FL:{"2025-01":2,"2025-03":1,"2025-08":2,"2025-09":2,"2025-10":2,"2025-11":1,"2026-01":2,"2026-02":1}, NJ:{"2025-01":3,"2025-04":1,"2025-05":1,"2025-06":1,"2025-07":2,"2025-08":1,"2025-09":6,"2025-10":6,"2025-12":1,"2026-01":14,"2026-02":5,"2026-03":8,"2026-04":13,"2026-05":1}, NY:{"2025-01":1,"2026-01":4,"2026-02":1,"2026-03":2,"2026-04":1,"2026-05":1}, PA:{"2024-11":1,"2025-01":3,"2025-02":1,"2025-05":1,"2025-06":1,"2025-08":2,"2025-10":3,"2025-11":3,"2026-01":40,"2026-02":3,"2026-03":2}, TX:{"2025-01":2,"2025-02":1,"2025-09":3,"2025-10":7,"2025-11":2,"2026-01":3,"2026-02":11,"2026-03":4}},
    plans:{AL:[{"p":"Dual Complete AL-S1","m":12}], DE:[{"p":"UHC Complete Care Support DE-5A","m":2}], FL:[{"p":"Dual Complete FL-Y5","m":9}, {"p":"Dual Complete FL-Y4","m":4}], NJ:[{"p":"Dual Complete NJ-Y001","m":33}, {"p":"AARP MA UHC NJ-0005","m":19}, {"p":"AARP MA Extras NJ-7","m":8}, {"p":"AARP MA UHC NJ-0002","m":2}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":1}], NY:[{"p":"AARP MA UHC NY-0005","m":4}, {"p":"AARP MA UHC NY-0012","m":3}, {"p":"Dual Complete NY-S002","m":2}, {"p":"AARP Medicare Advantage Patriot No Rx NY","m":1}], PA:[{"p":"Dual Complete PA-S3","m":60}], TX:[{"p":"Dual Complete TX-S003","m":28}, {"p":"Dual Complete TX-S5","m":3}, {"p":"Dual Complete TX-S4","m":1}, {"p":"Dual Complete TX-Y1","m":1}]},
    agents:[{n:"Gonzalez, Juliet",m:93,s:"PA",ss:["FL","PA","TX"],bs:{FL:2,PA:60,TX:31},agency:"JPM Solutions"}, {n:"Sixon, Patricia",m:54,s:"NJ",ss:["AL","DE","FL","NJ"],bs:{AL:8,DE:2,FL:11,NJ:33},agency:"JPM Solutions"}, {n:"Barry, Karitssa",m:4,s:"NJ",ss:["NJ"],bs:{NJ:4},agency:"JPM Solutions"}],
  },
  "Origin Insurance": {
    total:5, uniqueAgents:1,
    states:["NJ"],
    bobState:{NJ:{m:5,a:1}},
    aps:{NJ:1},
    monthly:{NJ:{"2024-06":2,"2024-07":1,"2025-01":2}},
    plans:{NJ:[{"p":"Dual Complete NJ-Y001","m":3}, {"p":"AARP MA UHC NJ-0005","m":2}]},
    agents:[{n:"Puente, Sandra",m:5,s:"NJ",ss:["NJ"],bs:{NJ:5},agency:"Origin Insurance"}],
  },
  "Gandhi, Manish": {
    total:4, uniqueAgents:1,
    states:["NJ"],
    bobState:{NJ:{m:4,a:1}},
    aps:{NJ:1},
    monthly:{NJ:{"2025-01":3,"2026-01":1}},
    plans:{NJ:[{"p":"AARP MA UHC NJ-0005","m":4}]},
    agents:[{n:"Gandhi, Manish",m:4,s:"NJ",ss:["NJ"],bs:{NJ:4},agency:"Gandhi, Manish"}],
  },
  "NextGen Health": {
    total:4, uniqueAgents:1,
    states:["NJ"],
    bobState:{NJ:{m:4,a:1}},
    aps:{NJ:1},
    monthly:{NJ:{"2026-03":4}},
    plans:{NJ:[{"p":"Dual Complete NJ-Y001","m":3}, {"p":"AARP MA Essentials NJ-1","m":1}]},
    agents:[{n:"Jimenez, Oliver",m:4,s:"NJ",ss:["NJ"],bs:{NJ:4},agency:"NextGen Health"}],
  },
};




const PLANS_BY_STATE = {
  AL:[{"p":"Dual Complete AL-S1","m":119}, {"p":"Dual Complete AL-V002","m":7}, {"p":"Dual Complete AL-D001","m":3}, {"p":"AARP MA UHC AL-6","m":1}],
  AZ:[{"p":"Dual Complete AZ-S001","m":66}, {"p":"AARP MA UHC AZ-002P","m":20}, {"p":"UHC Complete Care AZ-1P","m":15}, {"p":"AARP MA Extras AZ-5","m":10}, {"p":"AARP MA Essentials AZ-1","m":7}, {"p":"AARP MA Extras AZ-4","m":6}, {"p":"AARP MA UHC AZ-0003","m":6}, {"p":"AARP MA Essentials AZ-2","m":5}],
  CA:[{"p":"AARP MA UHC CA-004P","m":21}, {"p":"AARP MA UHC CA-0005","m":4}, {"p":"AARP MA UHC CA-0010","m":4}, {"p":"AARP MA UHC CA-006P","m":4}, {"p":"AARP MA UHC CA-021P","m":3}, {"p":"UHC Complete Care CA-18P","m":3}, {"p":"AARP MA UHC CA-023P","m":2}, {"p":"AARP Medicare Advantage Giveback from UH","m":1}],
  CO:[{"p":"Dual Complete CO-S4","m":379}, {"p":"Dual Complete CO-S002","m":25}, {"p":"AARP MA Extras CO-5","m":4}, {"p":"AARP MA Extras CO-20","m":3}, {"p":"Dual Complete CO-V001","m":2}, {"p":"AARP Medicare Advantage Patriot No Rx CO","m":1}, {"p":"AARP MA UHC CO-0013","m":1}, {"p":"UHC Complete Care CO-1P","m":1}],
  CT:[{"p":"Dual Complete CT-S2","m":338}, {"p":"Dual Complete CT-Q001","m":52}, {"p":"Dual Complete CT-S001","m":32}, {"p":"UHC Medicare Advantage CT-0002","m":9}, {"p":"UHC Medicare Advantage CT-0003","m":4}, {"p":"UHC Medicare Advantage Patriot No Rx CT-","m":1}],
  DE:[{"p":"UHC Complete Care Support DE-5A","m":222}, {"p":"AARP MA Extras DE-6","m":32}, {"p":"UHC Complete Care DE-4","m":21}, {"p":"AARP MA Essentials DE-3","m":4}, {"p":"AARP MA UHC DE-0002","m":4}, {"p":"AARP MA UHC DE-0001","m":1}],
  FL:[{"p":"Dual Complete FL-Y5","m":2411}, {"p":"Dual Complete FL-Y4","m":753}, {"p":"UHC Preferred Dual Complete FL-Y2","m":333}, {"p":"Dual Complete FL-D002","m":125}, {"p":"Dual Complete FL-D003","m":47}, {"p":"UHC Preferred Dual Complete FL-Y3","m":44}, {"p":"UHC Complete Care FL-14","m":42}, {"p":"Dual Complete FL-D006","m":40}],
  GA:[{"p":"Dual Complete GA-S3","m":24}, {"p":"Dual Complete GA-D2","m":15}, {"p":"Dual Complete GA-S2","m":8}, {"p":"Dual Complete GA-S1","m":6}, {"p":"AARP MA UHC GA-5","m":3}, {"p":"UHC Complete Care GA-3","m":1}, {"p":"UHC Complete Care Support GA-9","m":1}, {"p":"UHC Complete Care Support GS-1A","m":1}],
  LA:[{"p":"Peoples Health Dual Complete LA-S5","m":83}, {"p":"Peoples Health Secure Complete","m":14}, {"p":"Peoples Health Choices 65","m":1}, {"p":"Peoples Health Complete Care LA-6","m":1}, {"p":"Dual Complete LA-S001","m":1}, {"p":"Dual Complete LA-S003","m":1}, {"p":"Dual Complete LA-S4","m":1}],
  MI:[{"p":"Dual Complete MI-S3","m":50}, {"p":"Dual Complete MI-Y1","m":44}, {"p":"UHC Complete Care Support MI-3","m":4}, {"p":"Dual Complete MI-S002","m":4}, {"p":"AARP MA UHC MI-0001","m":2}, {"p":"AARP MA UHC MI-0002","m":2}, {"p":"Dual Complete MI-S001","m":1}],
  NC:[{"p":"Dual Complete NC-S3","m":1006}, {"p":"AARP MA UHC NC-0015","m":79}, {"p":"Dual Complete NC-D001","m":67}, {"p":"UHC Complete Care NC-28","m":26}, {"p":"AARP MA UHC NC-0021","m":25}, {"p":"AARP MA UHC NC-24","m":21}, {"p":"Dual Complete NC-S001","m":21}, {"p":"AARP MA UHC NC-26","m":16}],
  NJ:[{"p":"AARP MA UHC NJ-0005","m":2977}, {"p":"Dual Complete NJ-Y001","m":1893}, {"p":"AARP MA Extras NJ-7","m":992}, {"p":"AARP MA UHC NJ-6","m":226}, {"p":"AARP MA Essentials NJ-1","m":182}, {"p":"AARP MA UHC NJ-0004","m":100}, {"p":"AARP Medicare Advantage Patriot No Rx NJ","m":10}, {"p":"AARP MA UHC NJ-0002","m":8}],
  NY:[{"p":"AARP MA UHC NY-0005","m":119}, {"p":"AARP Medicare Advantage Patriot No Rx NY","m":86}, {"p":"Dual Complete NY-S002","m":77}, {"p":"AARP MA UHC NY-29","m":34}, {"p":"AARP MA UHC NY-0012","m":19}, {"p":"AARP MA UHC NY-0006","m":18}, {"p":"Dual Complete NY-S001","m":12}, {"p":"AARP MA UHC NY-34","m":9}],
  OH:[{"p":"Dual Complete OH-S3","m":197}, {"p":"Dual Complete OH-S2","m":122}, {"p":"Dual Complete OH-D001","m":23}, {"p":"UHC Complete Care OH-18","m":11}, {"p":"AARP MA UHC OH-18","m":7}, {"p":"AARP MA Extras OH-10","m":5}, {"p":"Dual Complete OH-D002","m":5}, {"p":"AARP MA Extras OH-9","m":4}],
  PA:[{"p":"Dual Complete PA-S3","m":2405}, {"p":"Dual Complete PA-S002","m":107}, {"p":"AARP MA UHC PA-0007","m":35}, {"p":"UHC Complete Care PA-17","m":34}, {"p":"AARP MA UHC PA-0011","m":26}, {"p":"AARP MA Extras PA-18","m":24}, {"p":"AARP MA UHC PA-0002","m":24}, {"p":"Dual Complete PA-S001","m":19}],
  RI:[{"p":"Dual Complete RI-S3","m":389}, {"p":"AARP MA UHC RI-0003","m":12}, {"p":"UHC Complete Care RI-4","m":5}, {"p":"Dual Complete RI-S001","m":2}, {"p":"AARP Medicare Advantage CareFlex from UH","m":1}, {"p":"AARP MA UHC RI-0002","m":1}, {"p":"Dual Complete RI-V001","m":1}],
  SC:[{"p":"Dual Complete SC-S001","m":10}, {"p":"AARP MA UHC SC-0004","m":9}, {"p":"UHC Complete Care Support SC-7","m":9}, {"p":"AARP MA UHC SC-0006","m":7}, {"p":"UHC Complete Care SC-1","m":7}, {"p":"Dual Complete SC-S2","m":6}, {"p":"AARP Medicare Advantage Patriot No Rx SC","m":2}, {"p":"Dual Complete SC-V001","m":2}],
  TN:[{"p":"Dual Complete TN-Y2","m":20}, {"p":"AARP Medicare Advantage Giveback from UH","m":5}, {"p":"Dual Complete TN-Y001","m":4}, {"p":"AARP MA UHC TN-0006","m":3}, {"p":"Dual Complete TN-S001","m":3}, {"p":"AARP MA UHC TC-0003","m":2}, {"p":"AARP MA UHC TN-0003","m":2}, {"p":"UHC Complete Care Support TC-6","m":1}],
  TX:[{"p":"Dual Complete TX-S003","m":2092}, {"p":"Dual Complete TX-Y1","m":243}, {"p":"Dual Complete TX-S5","m":103}, {"p":"AARP MA UHC TX-001P","m":74}, {"p":"AARP MA UHC TX-0043","m":61}, {"p":"Dual Complete TX-S4","m":53}, {"p":"Dual Complete TX-D002","m":40}, {"p":"AARP MA Extras TX-28","m":39}],
  VA:[{"p":"Dual Complete VA-Y002","m":282}, {"p":"Dual Complete VA-Y001","m":72}, {"p":"Dual Complete VA-Q001","m":20}, {"p":"AARP MA UHC VA-0004","m":17}, {"p":"Dual Complete VA-V001","m":17}, {"p":"AARP MA UHC VA-0011","m":14}, {"p":"AARP MA UHC VA-0008","m":13}, {"p":"AARP MA UHC VA-0012","m":11}],
  WI:[{"p":"Dual Complete WI-D3","m":5}, {"p":"Dual Complete WI-D002","m":1}],
};

// ── ZIP CODE DATA w/ COUNTY (real BOB, top 20 zips per state) ─────────────
const BOB_ZIP = {
  AL:[{"zip":"36104","city":"Montgomery","county":"Montgomery","m":4}, {"zip":"36701","city":"Selma","county":"Dallas","m":4}, {"zip":"35020","city":"Bessemer","county":"Jefferson","m":3}, {"zip":"35810","city":"Huntsville","county":"Madison","m":3}, {"zip":"36207","city":"Anniston","county":"Calhoun","m":3}, {"zip":"35633","city":"Florence","county":"Lauderdale","m":2}, {"zip":"35151","city":"Sylacauga","county":"Talladega","m":2}, {"zip":"35010","city":"Alexander City","county":"Tallapoosa","m":2}, {"zip":"35042","city":"Centreville","county":"Bibb","m":2}, {"zip":"36330","city":"Enterprise","county":"Coffee","m":2}, {"zip":"36303","city":"Dothan","county":"Houston","m":2}, {"zip":"36010","city":"Brundidge","county":"Pike","m":2}, {"zip":"36345","city":"Headland","county":"Henry","m":2}, {"zip":"36110","city":"Montgomery","county":"Montgomery","m":2}, {"zip":"36109","city":"Montgomery","county":"Montgomery","m":2}, {"zip":"36360","city":"Ozark","county":"Dale","m":2}, {"zip":"36350","city":"Midland City","county":"Dale","m":2}, {"zip":"35007","city":"Alabaster","county":"Shelby","m":2}, {"zip":"36867","city":"Phenix City","county":"Russell","m":2}, {"zip":"36116","city":"Montgomery","county":"Montgomery","m":2}],
  AZ:[{"zip":"85009","city":"Phoenix","county":"Maricopa","m":8}, {"zip":"85326","city":"Buckeye","county":"Maricopa","m":6}, {"zip":"85301","city":"Glendale","county":"Maricopa","m":5}, {"zip":"85031","city":"Phoenix","county":"Maricopa","m":4}, {"zip":"85745","city":"Tucson","county":"Pima","m":4}, {"zip":"85756","city":"Tucson","county":"Pima","m":4}, {"zip":"85051","city":"Phoenix","county":"Maricopa","m":4}, {"zip":"85710","city":"Tucson","county":"Pima","m":3}, {"zip":"85122","city":"Casa Grande","county":"Pinal","m":3}, {"zip":"85123","city":"Arizona City","county":"Pinal","m":3}, {"zip":"85017","city":"Phoenix","county":"Maricopa","m":3}, {"zip":"85035","city":"Phoenix","county":"Maricopa","m":3}, {"zip":"85705","city":"Tucson","county":"Pima","m":3}, {"zip":"85286","city":"Chandler","county":"Maricopa","m":3}, {"zip":"85132","city":"Florence","county":"Pinal","m":2}, {"zip":"85008","city":"Phoenix","county":"Maricopa","m":2}, {"zip":"85041","city":"Phoenix","county":"Maricopa","m":2}, {"zip":"85032","city":"Phoenix","county":"Maricopa","m":2}, {"zip":"85305","city":"Glendale","county":"Maricopa","m":2}, {"zip":"85225","city":"Chandler","county":"Maricopa","m":2}],
  CA:[{"zip":"90003","city":"Los Angeles","county":"Los Angeles","m":2}, {"zip":"90019","city":"Los Angeles","county":"Los Angeles","m":2}, {"zip":"92223","city":"Beaumont","county":"Riverside","m":2}, {"zip":"92405","city":"San Bernardino","county":"San Bernardino","m":2}, {"zip":"92835","city":"Fullerton","county":"Orange","m":2}, {"zip":"93552","city":"Palmdale","county":"Los Angeles","m":2}, {"zip":"91724","city":"Covina","county":"Los Angeles","m":2}, {"zip":"91911","city":"Chula Vista","county":"San Diego","m":2}, {"zip":"91343","city":"North Hills","county":"Los Angeles","m":2}, {"zip":"91324","city":"Northridge","county":"Los Angeles","m":2}, {"zip":"95826","city":"Sacramento","county":"Sacramento","m":2}, {"zip":"95453","city":"Lakeport","county":"Lake","m":2}, {"zip":"90061","city":"Los Angeles","county":"Los Angeles","m":1}, {"zip":"90046","city":"West Hollywood","county":"Los Angeles","m":1}, {"zip":"90022","city":"Los Angeles","county":"Los Angeles","m":1}, {"zip":"90020","city":"Los Angeles","county":"Los Angeles","m":1}, {"zip":"90011","city":"Los Angeles","county":"Los Angeles","m":1}, {"zip":"90002","city":"Los Angeles","county":"Los Angeles","m":1}, {"zip":"90066","city":"Los Angeles","county":"Los Angeles","m":1}, {"zip":"90063","city":"Los Angeles","county":"Los Angeles","m":1}],
  CO:[{"zip":"81501","city":"Grand Junction","county":"Mesa","m":17}, {"zip":"81401","city":"Montrose","county":"Montrose","m":14}, {"zip":"80219","city":"Denver","county":"Denver","m":13}, {"zip":"81504","city":"Grand Junction","county":"Mesa","m":13}, {"zip":"80634","city":"Greeley","county":"Weld","m":12}, {"zip":"81520","city":"Clifton","county":"Mesa","m":11}, {"zip":"80229","city":"Denver","county":"Adams","m":9}, {"zip":"81001","city":"Pueblo","county":"Pueblo","m":8}, {"zip":"80631","city":"Greeley","county":"Weld","m":8}, {"zip":"80022","city":"Commerce City","county":"Adams","m":8}, {"zip":"80013","city":"Aurora","county":"Arapahoe","m":8}, {"zip":"81521","city":"Fruita","county":"Mesa","m":8}, {"zip":"81301","city":"Durango","county":"La Plata","m":7}, {"zip":"81503","city":"Grand Junction","county":"Mesa","m":7}, {"zip":"81003","city":"Pueblo","county":"Pueblo","m":7}, {"zip":"81416","city":"Delta","county":"Delta","m":7}, {"zip":"81601","city":"Glenwood Springs","county":"Garfield","m":7}, {"zip":"80537","city":"Loveland","county":"Larimer","m":7}, {"zip":"81652","city":"Silt","county":"Garfield","m":6}, {"zip":"80015","city":"Aurora","county":"Arapahoe","m":5}],
  CT:[{"zip":"06810","city":"Danbury","county":"Fairfield","m":32}, {"zip":"06106","city":"Hartford","county":"Hartford","m":18}, {"zip":"06513","city":"New Haven","county":"New Haven","m":18}, {"zip":"06610","city":"Bridgeport","county":"Fairfield","m":18}, {"zip":"06902","city":"Stamford","county":"Fairfield","m":18}, {"zip":"06702","city":"Waterbury","county":"New Haven","m":16}, {"zip":"06854","city":"Norwalk","county":"Fairfield","m":14}, {"zip":"06608","city":"Bridgeport","county":"Fairfield","m":13}, {"zip":"06606","city":"Bridgeport","county":"Fairfield","m":13}, {"zip":"06605","city":"Bridgeport","county":"Fairfield","m":12}, {"zip":"06604","city":"Bridgeport","county":"Fairfield","m":12}, {"zip":"06051","city":"New Britain","county":"Hartford","m":11}, {"zip":"06511","city":"New Haven","county":"New Haven","m":10}, {"zip":"06450","city":"Meriden","county":"New Haven","m":9}, {"zip":"06114","city":"Hartford","county":"Hartford","m":9}, {"zip":"06226","city":"Willimantic","county":"Windham","m":9}, {"zip":"06706","city":"Waterbury","county":"New Haven","m":8}, {"zip":"06519","city":"New Haven","county":"New Haven","m":8}, {"zip":"06320","city":"New London","county":"New London","m":8}, {"zip":"06705","city":"Waterbury","county":"New Haven","m":8}],
  DE:[{"zip":"19805","city":"Wilmington","county":"New Castle","m":34}, {"zip":"19720","city":"New Castle","county":"New Castle","m":31}, {"zip":"19801","city":"Wilmington","county":"New Castle","m":17}, {"zip":"19904","city":"Dover","county":"Kent","m":15}, {"zip":"19966","city":"Millsboro","county":"Sussex","m":14}, {"zip":"19702","city":"Newark","county":"New Castle","m":13}, {"zip":"19973","city":"Seaford","county":"Sussex","m":10}, {"zip":"19901","city":"Dover","county":"Kent","m":9}, {"zip":"19713","city":"Newark","county":"New Castle","m":9}, {"zip":"19701","city":"Bear","county":"New Castle","m":9}, {"zip":"19933","city":"Bridgeville","county":"Sussex","m":8}, {"zip":"19952","city":"Harrington","county":"Kent","m":8}, {"zip":"19711","city":"Newark","county":"New Castle","m":8}, {"zip":"19802","city":"Wilmington","county":"New Castle","m":7}, {"zip":"19709","city":"Middletown","county":"New Castle","m":7}, {"zip":"19943","city":"Felton","county":"Kent","m":7}, {"zip":"19956","city":"Laurel","county":"Sussex","m":7}, {"zip":"19962","city":"Magnolia","county":"Kent","m":6}, {"zip":"19963","city":"Milford","county":"Sussex","m":6}, {"zip":"19803","city":"Wilmington","county":"New Castle","m":4}],
  FL:[{"zip":"32771","city":"Sanford","county":"Seminole","m":35}, {"zip":"33604","city":"Tampa","county":"Hillsborough","m":33}, {"zip":"32808","city":"Orlando","county":"Orange","m":32}, {"zip":"33126","city":"Miami","county":"Miami-Dade","m":29}, {"zip":"32805","city":"Orlando","county":"Orange","m":28}, {"zip":"34741","city":"Kissimmee","county":"Osceola","m":28}, {"zip":"34746","city":"Kissimmee","county":"Osceola","m":27}, {"zip":"33844","city":"Haines City","county":"Polk","m":26}, {"zip":"34744","city":"Kissimmee","county":"Osceola","m":26}, {"zip":"33610","city":"Tampa","county":"Hillsborough","m":26}, {"zip":"34471","city":"Ocala","county":"Marion","m":25}, {"zip":"32703","city":"Apopka","county":"Orange","m":25}, {"zip":"32738","city":"Deltona","county":"Volusia","m":25}, {"zip":"32244","city":"Jacksonville","county":"Duval","m":24}, {"zip":"33936","city":"Lehigh Acres","county":"Lee","m":24}, {"zip":"32901","city":"Melbourne","county":"Brevard","m":24}, {"zip":"32922","city":"Cocoa","county":"Brevard","m":23}, {"zip":"34475","city":"Ocala","county":"Marion","m":23}, {"zip":"34142","city":"Immokalee","county":"Collier","m":23}, {"zip":"33870","city":"Sebring","county":"Highlands","m":23}],
  GA:[{"zip":"39828","city":"Cairo","county":"Grady","m":6}, {"zip":"30046","city":"Lawrenceville","county":"Gwinnett","m":3}, {"zip":"30721","city":"Dalton","county":"Whitfield","m":3}, {"zip":"31750","city":"Fitzgerald","county":"Ben Hill","m":3}, {"zip":"30519","city":"Buford","county":"Gwinnett","m":3}, {"zip":"39827","city":"Cairo","county":"Grady","m":3}, {"zip":"31079","city":"Rochelle","county":"Wilcox","m":2}, {"zip":"30045","city":"Lawrenceville","county":"Gwinnett","m":2}, {"zip":"31093","city":"Warner Robins","county":"Houston","m":2}, {"zip":"31216","city":"Macon","county":"Bibb","m":2}, {"zip":"30078","city":"Snellville","county":"Gwinnett","m":1}, {"zip":"30075","city":"Roswell","county":"Fulton","m":1}, {"zip":"30017","city":"Grayson","county":"Gwinnett","m":1}, {"zip":"30021","city":"Clarkston","county":"Dekalb","m":1}, {"zip":"30047","city":"Lilburn","county":"Gwinnett","m":1}, {"zip":"30043","city":"Lawrenceville","county":"Gwinnett","m":1}, {"zip":"30315","city":"Atlanta","county":"Fulton","m":1}, {"zip":"30294","city":"Ellenwood","county":"Dekalb","m":1}, {"zip":"30120","city":"Cartersville","county":"Bartow","m":1}, {"zip":"30126","city":"Mableton","county":"Cobb","m":1}],
  LA:[{"zip":"70065","city":"Kenner","county":"Jefferson","m":5}, {"zip":"70506","city":"Lafayette","county":"Lafayette","m":4}, {"zip":"70535","city":"Eunice","county":"Saint Landry","m":4}, {"zip":"70122","city":"New Orleans","county":"Orleans","m":3}, {"zip":"70301","city":"Thibodaux","county":"Lafourche","m":3}, {"zip":"70501","city":"Lafayette","county":"Lafayette","m":3}, {"zip":"70364","city":"Houma","county":"Terrebonne","m":3}, {"zip":"71107","city":"Shreveport","county":"Caddo","m":2}, {"zip":"71418","city":"Columbia","county":"Caldwell","m":2}, {"zip":"71343","city":"Jonesville","county":"Catahoula","m":2}, {"zip":"70433","city":"Covington","county":"Saint Tammany","m":2}, {"zip":"70126","city":"New Orleans","county":"Orleans","m":2}, {"zip":"70128","city":"New Orleans","county":"Orleans","m":2}, {"zip":"70085","city":"Saint Bernard","county":"Saint Bernard","m":2}, {"zip":"70119","city":"New Orleans","county":"Orleans","m":2}, {"zip":"70363","city":"Houma","county":"Terrebonne","m":2}, {"zip":"70525","city":"Church Point","county":"Acadia","m":2}, {"zip":"70526","city":"Crowley","county":"Acadia","m":2}, {"zip":"70816","city":"Baton Rouge","county":"East Baton Rouge","m":2}, {"zip":"71360","city":"Pineville","county":"Rapides","m":2}],
  MI:[{"zip":"49507","city":"Grand Rapids","county":"Kent","m":7}, {"zip":"48126","city":"Dearborn","county":"Wayne","m":5}, {"zip":"48083","city":"Troy","county":"Oakland","m":5}, {"zip":"48071","city":"Madison Heights","county":"Oakland","m":4}, {"zip":"48073","city":"Royal Oak","county":"Oakland","m":4}, {"zip":"48342","city":"Pontiac","county":"Oakland","m":3}, {"zip":"48075","city":"Southfield","county":"Oakland","m":3}, {"zip":"48227","city":"Detroit","county":"Wayne","m":3}, {"zip":"48030","city":"Hazel Park","county":"Oakland","m":3}, {"zip":"48209","city":"Detroit","county":"Wayne","m":3}, {"zip":"49508","city":"Grand Rapids","county":"Kent","m":3}, {"zip":"49503","city":"Grand Rapids","county":"Kent","m":2}, {"zip":"48210","city":"Detroit","county":"Wayne","m":2}, {"zip":"48034","city":"Southfield","county":"Oakland","m":2}, {"zip":"48212","city":"Hamtramck","county":"Wayne","m":2}, {"zip":"48146","city":"Lincoln Park","county":"Wayne","m":2}, {"zip":"48340","city":"Pontiac","county":"Oakland","m":2}, {"zip":"49006","city":"Kalamazoo","county":"Kalamazoo","m":2}, {"zip":"49055","city":"Gobles","county":"Van Buren","m":2}, {"zip":"49093","city":"Three Rivers","county":"Saint Joseph","m":2}],
  NC:[{"zip":"28052","city":"Gastonia","county":"Gaston","m":30}, {"zip":"27610","city":"Raleigh","county":"Wake","m":25}, {"zip":"28273","city":"Charlotte","county":"Mecklenburg","m":22}, {"zip":"28215","city":"Charlotte","county":"Mecklenburg","m":17}, {"zip":"28314","city":"Fayetteville","county":"Cumberland","m":17}, {"zip":"28792","city":"Hendersonville","county":"Henderson","m":16}, {"zip":"27520","city":"Clayton","county":"Johnston","m":15}, {"zip":"28269","city":"Charlotte","county":"Mecklenburg","m":15}, {"zip":"27217","city":"Burlington","county":"Alamance","m":15}, {"zip":"28027","city":"Concord","county":"Cabarrus","m":15}, {"zip":"27215","city":"Burlington","county":"Alamance","m":14}, {"zip":"27330","city":"Sanford","county":"Lee","m":13}, {"zip":"27105","city":"Winston Salem","county":"Forsyth","m":13}, {"zip":"28348","city":"Hope Mills","county":"Cumberland","m":13}, {"zip":"27253","city":"Graham","county":"Alamance","m":13}, {"zip":"27893","city":"Wilson","county":"Wilson","m":12}, {"zip":"27284","city":"Kernersville","county":"Forsyth","m":12}, {"zip":"28306","city":"Fayetteville","county":"Cumberland","m":12}, {"zip":"27302","city":"Mebane","county":"Alamance","m":11}, {"zip":"27107","city":"Winston Salem","county":"Forsyth","m":11}],
  NJ:[{"zip":"07002","city":"Bayonne","county":"Hudson","m":494}, {"zip":"07305","city":"Jersey City","county":"Hudson","m":222}, {"zip":"08861","city":"Perth Amboy","county":"Middlesex","m":117}, {"zip":"07104","city":"Newark","county":"Essex","m":117}, {"zip":"07087","city":"Union City","county":"Hudson","m":111}, {"zip":"07307","city":"Jersey City","county":"Hudson","m":103}, {"zip":"07306","city":"Jersey City","county":"Hudson","m":97}, {"zip":"07047","city":"North Bergen","county":"Hudson","m":96}, {"zip":"07304","city":"Jersey City","county":"Hudson","m":85}, {"zip":"07083","city":"Union","county":"Union","m":77}, {"zip":"07093","city":"West New York","county":"Hudson","m":70}, {"zip":"07055","city":"Passaic","county":"Passaic","m":70}, {"zip":"07950","city":"Morris Plains","county":"Morris","m":69}, {"zip":"07107","city":"Newark","county":"Essex","m":67}, {"zip":"07036","city":"Linden","county":"Union","m":67}, {"zip":"07202","city":"Elizabeth","county":"Union","m":66}, {"zip":"07032","city":"Kearny","county":"Hudson","m":64}, {"zip":"07011","city":"Clifton","county":"Passaic","m":58}, {"zip":"08901","city":"New Brunswick","county":"Middlesex","m":58}, {"zip":"08105","city":"Camden","county":"Camden","m":51}],
  NY:[{"zip":"10463","city":"Bronx","county":"Bronx","m":8}, {"zip":"11209","city":"Brooklyn","county":"Kings","m":6}, {"zip":"10314","city":"Staten Island","county":"Richmond","m":6}, {"zip":"10023","city":"New York","county":"New York","m":5}, {"zip":"10701","city":"Yonkers","county":"Westchester","m":5}, {"zip":"10466","city":"Bronx","county":"Bronx","m":5}, {"zip":"11235","city":"Brooklyn","county":"Kings","m":5}, {"zip":"10034","city":"New York","county":"New York","m":4}, {"zip":"10033","city":"New York","county":"New York","m":4}, {"zip":"10457","city":"Bronx","county":"Bronx","m":4}, {"zip":"10589","city":"Somers","county":"Westchester","m":4}, {"zip":"11223","city":"Brooklyn","county":"Kings","m":4}, {"zip":"10306","city":"Staten Island","county":"Richmond","m":4}, {"zip":"10037","city":"New York","county":"New York","m":3}, {"zip":"11222","city":"Brooklyn","county":"Kings","m":3}, {"zip":"10472","city":"Bronx","county":"Bronx","m":3}, {"zip":"10465","city":"Bronx","county":"Bronx","m":3}, {"zip":"10471","city":"Bronx","county":"Bronx","m":3}, {"zip":"10024","city":"New York","county":"New York","m":3}, {"zip":"10458","city":"Bronx","county":"Bronx","m":3}],
  OH:[{"zip":"44102","city":"Cleveland","county":"Cuyahoga","m":23}, {"zip":"44052","city":"Lorain","county":"Lorain","m":14}, {"zip":"44053","city":"Lorain","county":"Lorain","m":13}, {"zip":"44055","city":"Lorain","county":"Lorain","m":13}, {"zip":"44004","city":"Ashtabula","county":"Ashtabula","m":13}, {"zip":"44109","city":"Cleveland","county":"Cuyahoga","m":9}, {"zip":"44111","city":"Cleveland","county":"Cuyahoga","m":8}, {"zip":"44035","city":"Elyria","county":"Lorain","m":8}, {"zip":"44030","city":"Conneaut","county":"Ashtabula","m":7}, {"zip":"43204","city":"Columbus","county":"Franklin","m":6}, {"zip":"43138","city":"Logan","county":"Hocking","m":6}, {"zip":"45014","city":"Fairfield","county":"Butler","m":6}, {"zip":"45680","city":"South Point","county":"Lawrence","m":6}, {"zip":"44077","city":"Painesville","county":"Lake","m":6}, {"zip":"45011","city":"Hamilton","county":"Butler","m":6}, {"zip":"44135","city":"Cleveland","county":"Cuyahoga","m":5}, {"zip":"44039","city":"North Ridgeville","county":"Lorain","m":5}, {"zip":"45638","city":"Ironton","county":"Lawrence","m":5}, {"zip":"44090","city":"Wellington","county":"Lorain","m":4}, {"zip":"44446","city":"Niles","county":"Trumbull","m":4}],
  PA:[{"zip":"19601","city":"Reading","county":"Berks","m":149}, {"zip":"19604","city":"Reading","county":"Berks","m":89}, {"zip":"17603","city":"Lancaster","county":"Lancaster","m":78}, {"zip":"17602","city":"Lancaster","county":"Lancaster","m":75}, {"zip":"19602","city":"Reading","county":"Berks","m":72}, {"zip":"18102","city":"Allentown","county":"Lehigh","m":51}, {"zip":"18702","city":"Wilkes Barre","county":"Luzerne","m":34}, {"zip":"18103","city":"Allentown","county":"Lehigh","m":28}, {"zip":"16101","city":"New Castle","county":"Lawrence","m":26}, {"zip":"16301","city":"Oil City","county":"Venango","m":25}, {"zip":"19605","city":"Reading","county":"Berks","m":25}, {"zip":"19606","city":"Reading","county":"Berks","m":23}, {"zip":"18201","city":"Hazleton","county":"Luzerne","m":23}, {"zip":"15401","city":"Uniontown","county":"Fayette","m":22}, {"zip":"19611","city":"Reading","county":"Berks","m":21}, {"zip":"15068","city":"New Kensington","county":"Westmoreland","m":19}, {"zip":"16503","city":"Erie","county":"Erie","m":19}, {"zip":"18052","city":"Whitehall","county":"Lehigh","m":18}, {"zip":"17404","city":"York","county":"York","m":18}, {"zip":"17046","city":"Lebanon","county":"Lebanon","m":17}],
  RI:[{"zip":"02907","city":"Providence","county":"Providence","m":46}, {"zip":"02860","city":"Pawtucket","county":"Providence","m":43}, {"zip":"02909","city":"Providence","county":"Providence","m":30}, {"zip":"02895","city":"Woonsocket","county":"Providence","m":27}, {"zip":"02863","city":"Central Falls","county":"Providence","m":25}, {"zip":"02904","city":"Providence","county":"Providence","m":18}, {"zip":"02908","city":"Providence","county":"Providence","m":17}, {"zip":"02903","city":"Providence","county":"Providence","m":12}, {"zip":"02861","city":"Pawtucket","county":"Providence","m":12}, {"zip":"02920","city":"Cranston","county":"Providence","m":12}, {"zip":"02919","city":"Johnston","county":"Providence","m":11}, {"zip":"02889","city":"Warwick","county":"Kent","m":10}, {"zip":"02852","city":"North Kingstown","county":"Washington","m":10}, {"zip":"02886","city":"Warwick","county":"Kent","m":9}, {"zip":"02888","city":"Warwick","county":"Kent","m":9}, {"zip":"02905","city":"Providence","county":"Providence","m":8}, {"zip":"02910","city":"Cranston","county":"Providence","m":8}, {"zip":"02915","city":"Riverside","county":"Providence","m":8}, {"zip":"02842","city":"Middletown","county":"Newport","m":7}, {"zip":"02840","city":"Newport","county":"Newport","m":7}],
  SC:[{"zip":"29910","city":"Bluffton","county":"Beaufort","m":6}, {"zip":"29906","city":"Beaufort","county":"Beaufort","m":3}, {"zip":"29334","city":"Duncan","county":"Spartanburg","m":2}, {"zip":"29511","city":"Aynor","county":"Horry","m":2}, {"zip":"29483","city":"Summerville","county":"Dorchester","m":2}, {"zip":"29650","city":"Greer","county":"Greenville","m":2}, {"zip":"29720","city":"Lancaster","county":"Lancaster","m":2}, {"zip":"29115","city":"Orangeburg","county":"Orangeburg","m":1}, {"zip":"29456","city":"Ladson","county":"Berkeley","m":1}, {"zip":"29418","city":"N Charleston","county":"Charleston","m":1}, {"zip":"29406","city":"North Charleston","county":"Charleston","m":1}, {"zip":"29229","city":"Columbia","county":"Richland","m":1}, {"zip":"29169","city":"Columbia","county":"Lexington","m":1}, {"zip":"29169","city":"West Columbia","county":"Lexington","m":1}, {"zip":"29526","city":"Conway","county":"Horry","m":1}, {"zip":"29468","city":"Pineville","county":"Berkeley","m":1}, {"zip":"29588","city":"Myrtle Beach","county":"Horry","m":1}, {"zip":"29611","city":"Greenville","county":"Greenville","m":1}, {"zip":"29644","city":"Fountain Inn","county":"Greenville","m":1}, {"zip":"29615","city":"Greenville","county":"Greenville","m":1}],
  TN:[{"zip":"37130","city":"Murfreesboro","county":"Rutherford","m":4}, {"zip":"37160","city":"Shelbyville","county":"Bedford","m":2}, {"zip":"37214","city":"Nashville","county":"Davidson","m":2}, {"zip":"37040","city":"Clarksville","county":"Montgomery","m":1}, {"zip":"37026","city":"Bradyville","county":"Cannon","m":1}, {"zip":"37013","city":"Antioch","county":"Davidson","m":1}, {"zip":"37042","city":"Clarksville","county":"Montgomery","m":1}, {"zip":"37137","city":"Nunnelly","county":"Hickman","m":1}, {"zip":"37087","city":"Lebanon","county":"Wilson","m":1}, {"zip":"37209","city":"Nashville","county":"Davidson","m":1}, {"zip":"37321","city":"Dayton","county":"Rhea","m":1}, {"zip":"37327","city":"Dunlap","county":"Bledsoe","m":1}, {"zip":"37406","city":"Chattanooga","county":"Hamilton","m":1}, {"zip":"37716","city":"Clinton","county":"Anderson","m":1}, {"zip":"37814","city":"Morristown","county":"Hamblen","m":1}, {"zip":"37846","city":"Philadelphia","county":"Loudon","m":1}, {"zip":"37857","city":"Rogersville","county":"Hawkins","m":1}, {"zip":"37863","city":"Pigeon Forge","county":"Sevier","m":1}, {"zip":"37870","city":"Speedwell","county":"Claiborne","m":1}, {"zip":"37915","city":"Knoxville","county":"Knox","m":1}],
  TX:[{"zip":"78040","city":"Laredo","county":"Webb","m":47}, {"zip":"78584","city":"Roma","county":"Starr","m":39}, {"zip":"78582","city":"Rio Grande City","county":"Starr","m":31}, {"zip":"78046","city":"Laredo","county":"Webb","m":29}, {"zip":"78852","city":"Eagle Pass","county":"Maverick","m":27}, {"zip":"78521","city":"Brownsville","county":"Cameron","m":26}, {"zip":"78526","city":"Brownsville","county":"Cameron","m":24}, {"zip":"77433","city":"Cypress","county":"Harris","m":23}, {"zip":"78228","city":"San Antonio","county":"Bexar","m":22}, {"zip":"77449","city":"Katy","county":"Harris","m":21}, {"zip":"78602","city":"Bastrop","county":"Bastrop","m":20}, {"zip":"77407","city":"Richmond","county":"Fort Bend","m":20}, {"zip":"77093","city":"Houston","county":"Harris","m":20}, {"zip":"78223","city":"San Antonio","county":"Bexar","m":20}, {"zip":"78207","city":"San Antonio","county":"Bexar","m":20}, {"zip":"78201","city":"San Antonio","county":"Bexar","m":19}, {"zip":"78245","city":"San Antonio","county":"Bexar","m":19}, {"zip":"77459","city":"Missouri City","county":"Fort Bend","m":19}, {"zip":"78076","city":"Zapata","county":"Zapata","m":18}, {"zip":"78233","city":"San Antonio","county":"Bexar","m":17}],
  VA:[{"zip":"23112","city":"Midlothian","county":"Chesterfield","m":16}, {"zip":"22191","city":"Woodbridge","county":"Prince William","m":11}, {"zip":"23224","city":"Richmond","county":"Richmond City","m":10}, {"zip":"23225","city":"Richmond","county":"Richmond City","m":9}, {"zip":"22304","city":"Alexandria","county":"Alexandria City","m":9}, {"zip":"23831","city":"Chester","county":"Chesterfield","m":9}, {"zip":"22193","city":"Woodbridge","county":"Prince William","m":8}, {"zip":"23223","city":"Richmond","county":"Richmond City","m":7}, {"zip":"20109","city":"Manassas","county":"Prince William","m":6}, {"zip":"20164","city":"Sterling","county":"Loudoun","m":6}, {"zip":"23234","city":"North Chesterfield","county":"Chesterfield","m":6}, {"zip":"24540","city":"Danville","county":"Danville City","m":5}, {"zip":"22554","city":"Stafford","county":"Stafford","m":5}, {"zip":"23464","city":"Virginia Beach","county":"Virginia Beach City","m":5}, {"zip":"23234","city":"Richmond","county":"Chesterfield","m":5}, {"zip":"23462","city":"Virginia Beach","county":"Virginia Beach City","m":5}, {"zip":"23504","city":"Norfolk","county":"Norfolk City","m":5}, {"zip":"20110","city":"Manassas","county":"Manassas City","m":5}, {"zip":"23234","city":"N Chesterfield","county":"Chesterfield","m":4}, {"zip":"22309","city":"Alexandria","county":"Fairfax","m":4}],
  WI:[{"zip":"54301","city":"Green Bay","county":"Brown","m":2}, {"zip":"53188","city":"Waukesha","county":"Waukesha","m":1}, {"zip":"53555","city":"Lodi","county":"Columbia","m":1}, {"zip":"54303","city":"Green Bay","county":"Brown","m":1}, {"zip":"54304","city":"Green Bay","county":"Brown","m":1}],
};

const AGENTS_TOTAL=[{n:"Viera, Jehonissi",m:745,s:"NJ",ss:["CO","FL","NC","NJ","PA","SC","TN","TX"],bs:{CO:7,FL:223,NC:119,NJ:266,PA:58,SC:11,TN:3,TX:58},agency:"Concep Care"}, {n:"Concepcion, Henry",m:740,s:"NJ",ss:["AL","CO","CT","FL","GA","MI","NJ","OH","PA","RI","TN","TX","VA","WI"],bs:{AL:20,CO:45,CT:18,FL:163,GA:15,MI:16,NJ:228,OH:65,PA:5,RI:139,TN:3,TX:5,VA:15,WI:3},agency:"Concep Care"}, {n:"Fernandez, Jonathan",m:722,s:"NJ",ss:["FL","NJ","PA"],bs:{FL:10,NJ:509,PA:203},agency:"AllCare Mar"}, {n:"Ayala Negron, Adriana",m:659,s:"PA",ss:["CA","CT","DE","FL","NC","NJ","NY","PA","TX"],bs:{CA:1,CT:52,DE:21,FL:14,NC:3,NJ:275,NY:4,PA:278,TX:11},agency:"AllCare Mar"}, {n:"Santiago, Maria",m:629,s:"NJ",ss:["AL","CA","CT","FL","GA","LA","NJ","NY","PA","RI","TX"],bs:{AL:75,CA:1,CT:1,FL:61,GA:3,LA:61,NJ:387,NY:19,PA:4,RI:10,TX:7},agency:"AllCare Mar"}, {n:"Fernandez, Jose",m:627,s:"PA",ss:["NJ","PA","TX"],bs:{NJ:194,PA:273,TX:160},agency:"Martell Multi"}, {n:"Ortega, Carlos",m:583,s:"NC",ss:["CA","FL","LA","NC","NJ","NY","OH","PA","SC","TN","TX"],bs:{CA:1,FL:8,LA:9,NC:476,NJ:5,NY:2,OH:11,PA:35,SC:14,TN:3,TX:19},agency:"AllCare Mar"}, {n:"Clark, Sara",m:564,s:"TX",ss:["FL","LA","NC","NJ","TX"],bs:{FL:2,LA:2,NC:35,NJ:41,TX:484},agency:"TCS & Associates"}, {n:"Colon, Glenda",m:543,s:"FL",ss:["FL","NC","NJ","NY","OH","PA","TX","VA"],bs:{FL:216,NC:2,NJ:199,NY:16,OH:47,PA:58,TX:3,VA:2},agency:"GW Ins Group"}, {n:"Pirez Guzman, Christopher",m:524,s:"FL",ss:["CA","FL","NJ","PA","TX"],bs:{CA:12,FL:312,NJ:71,PA:1,TX:128},agency:"Concep Care"}, {n:"Martin, Alvorine",m:522,s:"NJ",ss:["NC","NJ","NY","PA","SC","TX"],bs:{NC:2,NJ:263,NY:11,PA:2,SC:1,TX:243},agency:"AllCare Mar"}, {n:"Vega Figueroa, Jessica",m:518,s:"NJ",ss:["CO","CT","DE","FL","NC","NJ","PA","RI","TX"],bs:{CO:4,CT:82,DE:5,FL:71,NC:45,NJ:121,PA:107,RI:30,TX:53},agency:"Concep Care"}, {n:"Lopez-aguilar, Ramon",m:514,s:"TX",ss:["CO","FL","MI","NC","NJ","RI","TX"],bs:{CO:24,FL:175,MI:1,NC:107,NJ:2,RI:3,TX:202},agency:"Simarova Senior"}, {n:"Rivera De Montes, Desiree",m:511,s:"NC",ss:["AL","AZ","CO","CT","DE","FL","GA","MI","NC","NJ","NY","OH","PA","PR","SC","TN","TX","VA"],bs:{AL:2,AZ:6,CO:41,CT:7,DE:16,FL:21,GA:37,MI:5,NC:147,NJ:78,NY:2,OH:33,PA:29,PR:1,SC:6,TN:17,TX:44,VA:19},agency:"Concep Care"}, {n:"Monsalve, Maria",m:506,s:"NJ",ss:["DE","FL","NJ","NY","PA"],bs:{DE:5,FL:3,NJ:494,NY:3,PA:1},agency:"AllCare Mar"}, {n:"Quinones Medina, Christian",m:502,s:"TX",ss:["AZ","CO","CT","FL","GA","NC","NJ","PA","SC","TX","VA"],bs:{AZ:12,CO:8,CT:58,FL:34,GA:1,NC:24,NJ:98,PA:108,SC:3,TX:154,VA:2},agency:"AllCare Mar"}, {n:"Gibbs, Brittany",m:459,s:"PA",ss:["NJ","NY","PA"],bs:{NJ:208,NY:1,PA:250},agency:"KMRA Group"}, {n:"Rodriguez Benitez, Alison",m:432,s:"NJ",ss:["AZ","CT","DE","FL","NC","NJ","NY","OH","PA","PR","SC","TX","VA"],bs:{AZ:88,CT:13,DE:8,FL:38,NC:22,NJ:129,NY:3,OH:31,PA:25,PR:2,SC:11,TX:56,VA:6},agency:"GW Ins Group"}, {n:"Moralez, Tatiana",m:425,s:"NJ",ss:["CA","CO","CT","FL","GA","NC","NJ","PA","TX","VA"],bs:{CA:15,CO:8,CT:40,FL:46,GA:1,NC:131,NJ:144,PA:6,TX:33,VA:1},agency:"Concep Care"}, {n:"Pagan, Raul",m:394,s:"FL",ss:["CO","CT","FL","NJ","PA","RI","TX"],bs:{CO:2,CT:7,FL:274,NJ:11,PA:16,RI:8,TX:76},agency:"Concep Care"}, {n:"Calderon Monserrate, Lizmarie",m:376,s:"FL",ss:["CO","FL","NJ","PA","TX","VA"],bs:{CO:28,FL:253,NJ:3,PA:2,TX:67,VA:23},agency:"Concep Care"}, {n:"Nexuscare Innovations Dba Nexuscare Insurance Agency",m:374,s:"NJ",ss:["AZ","CA","CO","CT","FL","MI","NC","NJ","NY","PA","RI","SC","TN","TX","VA"],bs:{AZ:25,CA:11,CO:16,CT:5,FL:35,MI:6,NC:3,NJ:96,NY:25,PA:49,RI:1,SC:4,TN:3,TX:84,VA:11},agency:"AllCare Mar"}, {n:"Legacy Care Agency L.l.c.",m:357,s:"PA",ss:["FL","NJ","PA"],bs:{FL:4,NJ:13,PA:340},agency:"KMRA Group"}, {n:"Nunez, Alicia",m:334,s:"VA",ss:["NJ","NY","VA"],bs:{NJ:12,NY:20,VA:302},agency:"AllCare Mar"}, {n:"Simarova, Nikol",m:319,s:"CO",ss:["CO","CT","FL","MI","NC","NJ","OH","PA","RI","TX","VA","WI"],bs:{CO:94,CT:17,FL:21,MI:7,NC:4,NJ:83,OH:11,PA:20,RI:53,TX:4,VA:2,WI:3},agency:"Simarova Senior"}, {n:"Lopez Caro, Kimberly",m:306,s:"TX",ss:["CO","FL","MI","NC","NJ","OH","PA","TX","VA"],bs:{CO:41,FL:33,MI:2,NC:19,NJ:5,OH:49,PA:6,TX:150,VA:1},agency:"Simarova Senior"}, {n:"Rodriguez-martinez, Marcos",m:302,s:"NJ",ss:["CA","FL","NC","NJ","NY","OH","RI"],bs:{CA:13,FL:1,NC:1,NJ:274,NY:6,OH:1,RI:6},agency:"AllCare Mar"}, {n:"Munoz, Francia",m:277,s:"NJ",ss:["DE","FL","NC","NJ"],bs:{DE:1,FL:1,NC:1,NJ:274},agency:"AllCare Mar"}, {n:"Fernandez Abreu, Mercedes",m:270,s:"FL",ss:["FL","NJ"],bs:{FL:219,NJ:51},agency:"AllCare Mar"}, {n:"Christopher, Ana",m:265,s:"TX",ss:["CA","CO","CT","FL","GA","NJ","PA","TX"],bs:{CA:2,CO:35,CT:59,FL:8,GA:1,NJ:8,PA:67,TX:85},agency:"AllCare Mar"}, {n:"Sanchez Vazquez, Carlos",m:256,s:"PA",ss:["FL","MI","NC","NJ","PA","TX","VA"],bs:{FL:1,MI:36,NC:9,NJ:43,PA:144,TX:18,VA:5},agency:"AllCare Mar"}, {n:"Isaac Malave, Carlos",m:245,s:"FL",ss:["CO","FL","OH","PA"],bs:{CO:1,FL:205,OH:37,PA:2},agency:"Concep Care"}, {n:"Galarza, Priscilla",m:236,s:"FL",ss:["CT","FL","NJ","NY"],bs:{CT:24,FL:191,NJ:14,NY:7},agency:"AllCare Mar"}, {n:"De Los Angeles, Johnny",m:231,s:"FL",ss:["CT","DE","FL","NJ","NY","PA"],bs:{CT:53,DE:1,FL:113,NJ:59,NY:4,PA:1},agency:"GW Ins Group"}, {n:"Fialkowski-jaraczewski, Drew",m:231,s:"TX",ss:["CO","CT","FL","OH","RI","TX"],bs:{CO:27,CT:2,FL:36,OH:7,RI:42,TX:117},agency:"Simarova Senior"}, {n:"Colon, Carlos",m:223,s:"FL",ss:["AZ","FL","NJ","OH","PA","TX"],bs:{AZ:3,FL:138,NJ:17,OH:6,PA:1,TX:58},agency:"GW Ins Group"}, {n:"Jimenez, Oliver",m:220,s:"NJ",ss:["CT","DE","FL","NC","NJ","NY","PA","TN"],bs:{CT:1,DE:13,FL:4,NC:42,NJ:134,NY:2,PA:20,TN:4},agency:"AllCare Mar"}, {n:"Garcia, Jesus",m:200,s:"NJ",ss:["FL","NJ","TX","VA"],bs:{FL:1,NJ:108,TX:90,VA:1},agency:"Concep Care"}, {n:"Rodriguez, Jocelyn",m:199,s:"NY",ss:["DE","FL","NJ","NY"],bs:{DE:1,FL:41,NJ:67,NY:90},agency:"Top Tier Health"}, {n:"Pagan Perez, Keylin",m:197,s:"TX",ss:["NJ","TX"],bs:{NJ:1,TX:196},agency:"AMC Care Group"}, {n:"Balgobin, Iris",m:188,s:"NJ",ss:["AZ","FL","NJ","PA","TX","VA"],bs:{AZ:1,FL:32,NJ:129,PA:5,TX:3,VA:18},agency:"GW Ins Group"}, {n:"Vega, Julian",m:188,s:"NJ",ss:["AL","FL","NJ","NY","TX"],bs:{AL:10,FL:14,NJ:138,NY:25,TX:1},agency:"AllCare Mar"}, {n:"Munoz, Joshua",m:184,s:"NY",ss:["DE","FL","NJ","NY","PR"],bs:{DE:15,FL:5,NJ:70,NY:93,PR:1},agency:"Top Tier Health"}, {n:"Read Jacobo, Mariela",m:180,s:"FL",ss:["FL","NJ"],bs:{FL:169,NJ:11},agency:"AllCare Mar"}, {n:"Peguero Ruiz, Paola",m:169,s:"PA",ss:["DE","FL","NJ","PA","TX"],bs:{DE:34,FL:40,NJ:6,PA:81,TX:8},agency:"AllCare Mar"}, {n:"Perez Morales, Dayanisse",m:168,s:"FL",ss:["AZ","FL","NJ","TX"],bs:{AZ:4,FL:85,NJ:5,TX:74},agency:"Concep Care"}, {n:"Cruz Nunez, Emanuel",m:155,s:"TX",ss:["MI","NC","NY","TX"],bs:{MI:22,NC:6,NY:14,TX:113},agency:"AMC Care Group"}, {n:"Concep Care Insurance Agency,",m:151,s:"RI",ss:["CO","FL","NJ","OH","RI"],bs:{CO:9,FL:6,NJ:1,OH:16,RI:119},agency:"Concep Care"}, {n:"Gonzalez Rodriguez, Jason",m:146,s:"PA",ss:["CO","FL","PA","TX"],bs:{CO:18,FL:7,PA:101,TX:20},agency:"AllCare Mar"}, {n:"Perez Ferreira, Carlos",m:146,s:"NJ",ss:["FL","NJ","NY","PA","TX"],bs:{FL:2,NJ:113,NY:27,PA:3,TX:1},agency:"AllCare Mar"}, {n:"Uribe, Gisela",m:128,s:"NJ",ss:["FL","NJ","NY"],bs:{FL:1,NJ:126,NY:1},agency:"Martell Multi"}, {n:"Martell, Ana",m:127,s:"NJ",ss:["GA","NJ","PA","TX"],bs:{GA:1,NJ:98,PA:27,TX:1},agency:"Martell Multi"}, {n:"Rodriguez, Sara",m:127,s:"FL",ss:["FL","MI","NJ","OH","PA","TX"],bs:{FL:87,MI:4,NJ:2,OH:2,PA:9,TX:23},agency:"Simarova Senior"}, {n:"Molina Lopez, Sergio",m:126,s:"FL",ss:["FL","TX"],bs:{FL:121,TX:5},agency:"TCS & Associates"}, {n:"Gil, Ramon",m:124,s:"DE",ss:["DE","NJ","NY"],bs:{DE:102,NJ:15,NY:7},agency:"AllCare Mar"}, {n:"Padilla, Julissa",m:116,s:"PA",ss:["NJ","PA"],bs:{NJ:16,PA:100},agency:"Martell Multi"}, {n:"Diaz Garcia, Jose",m:113,s:"NJ",ss:["AZ","CO","FL","MI","NC","NJ","TN","TX"],bs:{AZ:7,CO:9,FL:14,MI:6,NC:7,NJ:55,TN:4,TX:11},agency:"AllCare Mar"}, {n:"Giunto, Glorivette",m:109,s:"NJ",ss:["FL","NJ","NY"],bs:{FL:1,NJ:104,NY:4},agency:"AllCare Mar"}, {n:"Pinzon, Roland",m:107,s:"NJ",ss:["FL","NJ","PA"],bs:{FL:1,NJ:64,PA:42},agency:"KMRA Group"}, {n:"Aljijakly, Muhammed",m:104,s:"FL",ss:["FL","NC","PA"],bs:{FL:67,NC:24,PA:13},agency:"Concep Care"}, {n:"King, Dawne",m:104,s:"FL",ss:["FL","NJ","TX"],bs:{FL:81,NJ:3,TX:20},agency:"TCS & Associates"}, {n:"Colon Perez, Yaisha",m:103,s:"FL",ss:["FL","NJ","VA"],bs:{FL:51,NJ:51,VA:1},agency:"AllCare Mar"}, {n:"Reyes, Olga",m:99,s:"NJ",ss:["NJ"],bs:{NJ:99},agency:"KMRA Group"}, {n:"Torres Ferrer, Aida",m:96,s:"OH",ss:["FL","NJ","OH","PA"],bs:{FL:35,NJ:3,OH:55,PA:3},agency:"Concep Care"}, {n:"Gonzalez, Juliet",m:93,s:"PA",ss:["FL","PA","TX"],bs:{FL:2,PA:60,TX:31},agency:"JPM Solutions"}, {n:"Liriano, Felix",m:93,s:"VA",ss:["NJ","VA"],bs:{NJ:3,VA:90},agency:"AllCare Mar"}, {n:"Acosta, Nancy",m:89,s:"NJ",ss:["DE","FL","NJ"],bs:{DE:32,FL:22,NJ:35},agency:"AllCare Mar"}, {n:"Moreno De Molina, Rosa",m:87,s:"FL",ss:["FL","TX"],bs:{FL:60,TX:27},agency:"TCS & Associates"}, {n:"Rivera Prentice, Tomas",m:87,s:"PA",ss:["AZ","NC","PA","TX"],bs:{AZ:2,NC:24,PA:59,TX:2},agency:"Simarova Senior"}, {n:"Rodriguez Rosich, Carlos",m:87,s:"PA",ss:["FL","PA","TX","VA"],bs:{FL:1,PA:80,TX:5,VA:1},agency:"AllCare Mar"}, {n:"Lopez, Nelson",m:74,s:"FL",ss:["FL"],bs:{FL:74},agency:"Simarova Senior"}, {n:"Kmra Group, Llc",m:69,s:"NJ",ss:["FL","NJ","PA"],bs:{FL:2,NJ:65,PA:2},agency:"KMRA Group"}, {n:"Mazzoncini, Pablo",m:65,s:"FL",ss:["FL","TX"],bs:{FL:53,TX:12},agency:"TCS & Associates"}, {n:"Castillo, Destiny",m:59,s:"TX",ss:["NJ","TX"],bs:{NJ:5,TX:54},agency:"TCS & Associates"}, {n:"Granger, Desiree",m:57,s:"TX",ss:["LA","TX"],bs:{LA:11,TX:46},agency:"TCS & Associates"}, {n:"Sixon, Patricia",m:54,s:"NJ",ss:["AL","DE","FL","NJ"],bs:{AL:8,DE:2,FL:11,NJ:33},agency:"JPM Solutions"}, {n:"Miranda Rivera, Fabiola",m:53,s:"FL",ss:["FL","NJ","PA","TX"],bs:{FL:24,NJ:6,PA:13,TX:10},agency:"GW Ins Group"}, {n:"Barry, Christopher",m:51,s:"NJ",ss:["NJ"],bs:{NJ:51},agency:"GW Ins Group"}, {n:"Garcia Skerrett, Nestor",m:48,s:"TX",ss:["CO","LA","TX"],bs:{CO:1,LA:17,TX:30},agency:"Simarova Senior"}, {n:"Cruz Rodriguez, Guillermo",m:47,s:"FL",ss:["FL","NC","NJ","PA","TX"],bs:{FL:22,NC:2,NJ:15,PA:2,TX:6},agency:"Concep Care"}, {n:"National Contracting Center Inc",m:47,s:"NJ",ss:["NJ"],bs:{NJ:47},agency:"AllCare Mar"}, {n:"Hoover, Theron",m:45,s:"TX",ss:["NJ","TX"],bs:{NJ:1,TX:44},agency:"TCS & Associates"}, {n:"Hyman, Ulysses",m:41,s:"DE",ss:["DE","NJ"],bs:{DE:28,NJ:13},agency:"AllCare Mar"}, {n:"Allcare Mar Agency Llc",m:40,s:"NJ",ss:["FL","NC","NJ"],bs:{FL:1,NC:1,NJ:38},agency:"AllCare Mar"}, {n:"Rodriguez, Mayra",m:39,s:"TX",ss:["FL","PA","TX"],bs:{FL:3,PA:10,TX:26},agency:"KMRA Group"}, {n:"The Rivera Montes Group Llc,",m:39,s:"NC",ss:["AZ","FL","MI","NC","NJ","PA","TN"],bs:{AZ:2,FL:1,MI:3,NC:20,NJ:4,PA:7,TN:2},agency:"Concep Care"}, {n:"Clark, Joshua",m:38,s:"TX",ss:["NJ","TX"],bs:{NJ:6,TX:32},agency:"TCS & Associates"}, {n:"Soriano, Elias",m:36,s:"NJ",ss:["NJ"],bs:{NJ:36},agency:"AllCare Mar"}, {n:"Castillo, Lisa",m:32,s:"TX",ss:["TX"],bs:{TX:32},agency:"TCS & Associates"}, {n:"Bartolomey Cotto, Jose",m:31,s:"FL",ss:["CT","FL","OH","TX"],bs:{CT:2,FL:13,OH:11,TX:5},agency:"GW Ins Group"}, {n:"Rosario, Maria",m:31,s:"FL",ss:["FL"],bs:{FL:31},agency:"AllCare Mar"}, {n:"Faulcon, Cadorsil",m:24,s:"NJ",ss:["NJ","PA"],bs:{NJ:23,PA:1},agency:"AllCare Mar"}, {n:"Wilds, China",m:24,s:"NC",ss:["NC"],bs:{NC:24},agency:"TCS & Associates"}, {n:"Rodriguez, Luis",m:22,s:"AL",ss:["AL","NJ","TN"],bs:{AL:16,NJ:4,TN:2},agency:"AllCare Mar"}, {n:"Beltran, Mindi",m:17,s:"TX",ss:["TX"],bs:{TX:17},agency:"AllCare Mar"}, {n:"Puente, Sandra",m:17,s:"NJ",ss:["NJ"],bs:{NJ:17},agency:"AllCare Mar"}, {n:"Arratia Araneda, Nicole",m:14,s:"FL",ss:["FL","NJ"],bs:{FL:10,NJ:4},agency:"AllCare Mar"}, {n:"Simarova Senior Solutions Llc Dba Simarova Senior Insurance Solutions",m:13,s:"RI",ss:["CO","FL","NC","PA","RI","TX"],bs:{CO:2,FL:3,NC:1,PA:2,RI:4,TX:1},agency:"Simarova Senior"}, {n:"Sinigaglia Lopez, Livia",m:13,s:"FL",ss:["FL"],bs:{FL:13},agency:"GW Ins Group"}, {n:"Gandhi, Manish",m:12,s:"NJ",ss:["NJ"],bs:{NJ:12},agency:"AllCare Mar"}, {n:"Brito Uribe, Gabriela",m:11,s:"NJ",ss:["NJ"],bs:{NJ:11},agency:"Martell Multi"}, {n:"Rodriguez, Alice",m:11,s:"NY",ss:["NJ","NY"],bs:{NJ:3,NY:8},agency:"Top Tier Health"}, {n:"Alexander, Melissa",m:10,s:"TX",ss:["TX"],bs:{TX:10},agency:"TCS & Associates"}, {n:"Cruz, Lissette",m:10,s:"NJ",ss:["NJ","NY"],bs:{NJ:8,NY:2},agency:"AllCare Mar"}, {n:"Ortiz, Amanda",m:10,s:"PA",ss:["PA"],bs:{PA:10},agency:"KMRA Group"}, {n:"Abbott, Gale",m:9,s:"NJ",ss:["NJ"],bs:{NJ:9},agency:"Martell Multi"}, {n:"Martell Multi Service Llc",m:9,s:"NJ",ss:["NJ"],bs:{NJ:9},agency:"Martell Multi"}, {n:"Bautista, Yanice",m:8,s:"NJ",ss:["NJ","RI"],bs:{NJ:7,RI:1},agency:"Concep Care"}, {n:"Munoz, Danilo",m:8,s:"NJ",ss:["NJ","NY"],bs:{NJ:7,NY:1},agency:"Top Tier Health"}, {n:"Tcs & Associates Llc",m:8,s:"TX",ss:["TX"],bs:{TX:8},agency:"TCS & Associates"}, {n:"Veitia Mendez, Idalmis",m:7,s:"FL",ss:["FL"],bs:{FL:7},agency:"AllCare Mar"}, {n:"Acosta, Melissa",m:6,s:"PA",ss:["NJ","PA"],bs:{NJ:1,PA:5},agency:"KMRA Group"}, {n:"Gray, Tayler",m:6,s:"NJ",ss:["NJ"],bs:{NJ:6},agency:"AllCare Mar"}, {n:"Rodriguez Contreras, Sixto",m:5,s:"NJ",ss:["NJ"],bs:{NJ:5},agency:"AllCare Mar"}, {n:"Young, Kelley",m:5,s:"FL",ss:["FL"],bs:{FL:5},agency:"Concep Care"}, {n:"Barry, Karitssa",m:4,s:"NJ",ss:["NJ"],bs:{NJ:4},agency:"JPM Solutions"}, {n:"Contreras, Natalie",m:4,s:"NJ",ss:["CT","NJ","NY"],bs:{CT:1,NJ:2,NY:1},agency:"AllCare Mar"}, {n:"Polanco, Maribel",m:4,s:"NJ",ss:["NJ"],bs:{NJ:4},agency:"Martell Multi"}, {n:"Gamboa, Marilyn",m:3,s:"FL",ss:["FL"],bs:{FL:3},agency:"GW Ins Group"}, {n:"Pujols De Gonzalez, Luz",m:3,s:"NJ",ss:["NJ"],bs:{NJ:3},agency:"AllCare Mar"}, {n:"Walker, Jamilla",m:3,s:"NJ",ss:["NJ"],bs:{NJ:3},agency:"AllCare Mar"}, {n:"Cole, Matina",m:2,s:"FL",ss:["FL"],bs:{FL:2},agency:"TCS & Associates"}, {n:"Dieuveuille, Gina",m:2,s:"NY",ss:["NY"],bs:{NY:2},agency:"Top Tier Health"}, {n:"Landaverde, Jessenia",m:2,s:"PA",ss:["PA"],bs:{PA:2},agency:"KMRA Group"}, {n:"Lopez Rivera, Jessica",m:2,s:"FL",ss:["FL"],bs:{FL:2},agency:"Concep Care"}, {n:"Marciano, Alysia",m:2,s:"FL",ss:["FL","NJ"],bs:{FL:1,NJ:1},agency:"AllCare Mar"}, {n:"Precise Insurance Brokerage Llc",m:2,s:"NY",ss:["NY"],bs:{NY:2},agency:"GW Ins Group"}, {n:"Ramirez, Sergio",m:2,s:"NJ",ss:["NJ"],bs:{NJ:2},agency:"Martell Multi"}, {n:"Sanchez, Samir",m:2,s:"NJ",ss:["NJ"],bs:{NJ:2},agency:"KMRA Group"}, {n:"Bautista Mota, Carlos",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"Concep Care"}, {n:"Elmenayer, Wafaa",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"AllCare Mar"}, {n:"Rodriguez Cuevas, Yemili",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"GW Ins Group"}, {n:"Rodriguez, Sandra",m:1,s:"TX",ss:["TX"],bs:{TX:1},agency:"Concep Care"}, {n:"Tanksley, Tammy",m:1,s:"NJ",ss:["NJ"],bs:{NJ:1},agency:"KMRA Group"}];

// TOP_PLANS computed dynamically

// PERIODS now computed dynamically in chart render - see periodsData useMemo


const CMS_URL="https://data.cms.gov/data-api/v1/dataset/d7fabe1e-d19b-4333-9eff-e80e0643f2fd/data";

const AGENTS_PER_STATE = {AL:6, AZ:10, CA:8, CO:20, CT:17, DE:15, FL:77, GA:7, LA:5, MI:11, NC:27, NJ:97, NY:29, OH:16, PA:52, RI:11, SC:7, TN:10, TX:59, VA:17, WI:2};

const LICENSES_PER_STATE = {
  AL:53,
  AZ:90,
  CA:77,
  CO:171,
  CT:163,
  DE:92,
  FL:395,
  GA:74,
  LA:31,
  MI:90,
  NC:211,
  NJ:408,
  NY:164,
  OH:124,
  PA:313,
  RI:98,
  SC:80,
  TN:91,
  TX:334,
  VA:140,
  WI:25,
};

const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(0)+"K":String(n||0);
const heat=v=>v>0.8?"#b91c1c":v>0.6?"#ea580c":v>0.4?"#d97706":v>0.2?"#0ea5e9":"#1e40af";

// ── BADGES ───────────────────────────────────────────────────────────────────
function CmsBadge({live}){
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:5,background:live?"#052e16":"#0a1628",border:"1px solid "+(live?"#16a34a55":"#1e40af55"),borderRadius:6,padding:"4px 10px",fontSize:10,color:live?"#86efac":"#93c5fd"}}>
      {live?"🟢":"🏛"} <span>{live?<><strong style={{color:"#4ade80"}}>LIVE</strong>  ·  CMS API 2024</>:<><strong style={{color:"#60a5fa"}}>CMS</strong> Enrollment 2024</>}</span>
    </div>
  );
}
function BobBadge(){
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:5,background:"#1a0f2e",border:"1px solid #8b5cf655",borderRadius:6,padding:"4px 10px",fontSize:10,color:"#c4b5fd"}}>
      📊 <strong style={{color:"#a78bfa"}}>BOB REAL</strong>  ·  21,648 policies  ·  776 counties  ·  4,275 zips  ·  04-28-2026
    </div>
  );
}

// ── KPI CARD ─────────────────────────────────────────────────────────────────
function KpiCard({label,value,sub,accent,icon,active,onClick,clickable}){
  return(
    <div onClick={clickable?onClick:undefined} style={{background:active?accent+"18":"#0f172a",border:(active?"2px":"1px")+" solid "+(active?accent:accent+"33"),borderRadius:12,padding:"14px 18px",flex:"1 1 148px",cursor:clickable?"pointer":"default",transition:"all 0.2s",position:"relative"}}>
      {clickable&&<div style={{position:"absolute",top:7,right:9,fontSize:9,color:active?accent:"#334155",fontWeight:700}}>{active?"● ON MAP":"TAP → MAP"}</div>}
      <div style={{fontSize:17,marginBottom:3}}>{icon}</div>
      <div style={{color:"#475569",fontSize:10,letterSpacing:1.1,textTransform:"uppercase"}}>{label}</div>
      <div style={{color:active?accent:"#f1f5f9",fontSize:21,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",margin:"4px 0"}}>{value}</div>
      <div style={{color:accent,fontSize:11}}>{sub}</div>
    </div>
  );
}

// ── AGENCY FILTER ─────────────────────────────────────────────────────────────
function AgencyFilter({ agencies, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selObj = selected ? agencies.find(a => a.short === selected) : null;
  return (
    <div ref={ref} style={{position:"relative",zIndex:101}}>
      <button
        onClick={() => setOpen(!open)}
        style={{background:"#0f172a",border:"2px solid "+UHC_GOLD,borderRadius:8,color:"#f1f5f9",padding:"9px 16px",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:8,minWidth:200}}
      >
        <span>🏢</span>
        <span style={{flex:1,textAlign:"left",color:selected?UHC_GOLD:"#f1f5f9",fontWeight:selected?700:400}}>
          {selected || "All Agencies"}
        </span>
        {selected && (
          <span
            onClick={e=>{e.stopPropagation();onChange(null);}}
            style={{color:"#ef4444",fontSize:14,fontWeight:700,padding:"0 4px",cursor:"pointer"}}
          >✕</span>
        )}
        {!selected && <span style={{color:UHC_GOLD,fontSize:10}}>{open?"▲":"▼"}</span>}
      </button>
      {open && (
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,background:"#0c1222",border:"1px solid "+UHC_GOLD+"66",borderRadius:10,padding:8,minWidth:280,boxShadow:"0 24px 50px #00000099",zIndex:200}}>
          <div
            onClick={()=>{onChange(null);setOpen(false);}}
            style={{padding:"8px 12px",cursor:"pointer",color:!selected?UHC_GOLD:"#94a3b8",fontSize:13,fontWeight:!selected?700:400,borderBottom:"1px solid #1e293b",marginBottom:4,display:"flex",alignItems:"center",gap:8}}
          >
            <span>🌐</span> All Agencies
            <span style={{marginLeft:"auto",color:"#334155",fontSize:11}}>21,648 policies</span>
          </div>
          {agencies.map(a => (
            <div
              key={a.short}
              onClick={()=>{onChange(a.short);setOpen(false);}}
              style={{padding:"7px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,borderRadius:6,background:selected===a.short?"#1e3a5f":"transparent",marginBottom:2}}
            >
              <span style={{width:14,color:"#10b981",fontSize:11}}>{selected===a.short?"✓":""}</span>
              <div style={{flex:1}}>
                <div style={{color:"#f1f5f9",fontSize:13,fontWeight:selected===a.short?700:400}}>{a.short}</div>
                <div style={{color:"#475569",fontSize:10}}>{a.states.slice(0,6).join(", ")}{a.states.length>6?"...":""}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:UHC_GOLD,fontWeight:700,fontSize:13}}>{a.m.toLocaleString()}</div>
                <div style={{color:"#334155",fontSize:9}}>{a.a} agents</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── STATE SELECTOR ────────────────────────────────────────────────────────────
function StateSel({states,sel,onChange}){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);
  const tog=s=>onChange(sel.includes(s)?sel.filter(x=>x!==s):[...sel,s]);
  return(
    <div ref={ref} style={{position:"relative",zIndex:100}}>
      <button onClick={()=>setOpen(!open)} style={{background:"#0f172a",border:"1px solid "+UHC_GOLD+"88",borderRadius:8,color:"#f1f5f9",padding:"9px 16px",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:8,minWidth:230}}>
        <span>🗺</span>
        <span style={{flex:1,textAlign:"left"}}>{sel.length===0?"All States":sel.join(", ")}</span>
        <span style={{color:UHC_GOLD,fontSize:10}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,background:"#0c1222",border:"1px solid "+UHC_GOLD+"44",borderRadius:10,padding:8,minWidth:260,maxHeight:300,overflowY:"auto",boxShadow:"0 24px 50px #00000099"}}>
          <div onClick={()=>onChange(sel.length===states.length?[]:[...states])} style={{padding:"7px 12px",cursor:"pointer",color:UHC_GOLD,fontSize:13,fontWeight:700,borderBottom:"1px solid #1e293b",marginBottom:4}}>
            {sel.length===states.length?"☑ Deselect All":"☐ Select All"}
          </div>
          {states.map(s=>(
            <div key={s} onClick={()=>tog(s)} style={{padding:"6px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,borderRadius:6,background:sel.includes(s)?"#1e3a5f":"transparent"}}>
              <span style={{width:14,color:"#10b981"}}>{sel.includes(s)?"✓":""}</span>
              <span style={{fontWeight:700,color:"#f1f5f9",minWidth:30}}>{s}</span>
              <span style={{flex:1,color:"#94a3b8",fontSize:12}}>{SNAME[s]||s}</span>
              <span style={{color:"#334155",fontSize:11}}>{fmt(BOB[s]?BOB[s].m:0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── COUNTY PANEL ──────────────────────────────────────────────────────────────
function CPanel({county,mode,onClose}){
  if(!county)return null;
  const{fips,county:cName,state,bobM,eligible,maEnrolled,ffsGap,pen,agents,isLive}=county;
  const mc=mode==="eligible"?ELIGIBLE:ENROLL;
  return(
    <div style={{position:"absolute",top:12,right:12,width:292,zIndex:300,background:"#080e1d",border:"1.5px solid "+mc+"88",borderRadius:14,overflow:"hidden",boxShadow:"0 20px 40px #000000aa"}}>
      <style>{"@keyframes pIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}} .cp{animation:pIn 0.18s ease}"}</style>
      <div className="cp">
        <div style={{background:"linear-gradient(135deg,#001a5e,#002677)",padding:"13px 15px",borderBottom:"2px solid "+mc}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:17,color:"#fff"}}>{cName} County</div>
              <div style={{color:"#93c5fd",fontSize:11,marginTop:2}}>{SNAME[state]||state}  ·  FIPS {fips}</div>
            </div>
            <button onClick={onClose} style={{background:"#ffffff15",border:"1px solid #ffffff25",borderRadius:6,color:"#94a3b8",cursor:"pointer",padding:"2px 8px",fontSize:14,marginLeft:8}}>✕</button>
          </div>
          <div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:8,background:mc+"22",borderRadius:8,padding:"6px 12px",border:"1px solid "+mc+"44"}}>
            <span style={{color:mc,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif",fontSize:26}}>
              {mode==="eligible"?fmt(eligible):fmt(bobM||0)}
            </span>
            <div>
              <div style={{color:"#fff",fontSize:11,fontWeight:600}}>{mode==="eligible"?"MA-Eligible (CMS LIVE)":"Real BOB Members"}</div>
              <div style={{color:"#93c5fd",fontSize:10}}>{mode==="eligible"?"Source: CMS API 2024":"Source: ACM BOB 04-28-2026"}</div>
            </div>
          </div>
        </div>
        <div style={{padding:"7px 15px",background:"#0d1f3c",borderBottom:"1px solid #1e293b",display:"flex",gap:6,flexWrap:"wrap"}}>
          <CmsBadge live={isLive}/><BobBadge/>
        </div>
        <div style={{padding:"13px 15px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
            {[["BOB Members",fmt(bobM||0),"#a78bfa"],["MA-Eligible",fmt(eligible),ELIGIBLE],["MA Penetration",pen+"%",UHC_GOLD],["In FFS (avail)",fmt(ffsGap),"#f97316"],["Already in MA",fmt(maEnrolled),"#0ea5e9"],["Agents (state)",agents,"#8b5cf6"]].map(([l,v,c])=>(
              <div key={l} style={{background:"#0f172a",borderRadius:7,padding:"9px 10px",border:"1px solid "+c+"22"}}>
                <div style={{color:"#475569",fontSize:9,textTransform:"uppercase",letterSpacing:0.7,marginBottom:3}}>{l}</div>
                <div style={{color:c,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:15}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:11}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{color:"#475569",fontSize:10}}>MA Penetration Rate</span>
              <span style={{color:UHC_GOLD,fontWeight:700,fontSize:10}}>{pen}%</span>
            </div>
            <div style={{background:"#1e293b",borderRadius:4,height:7,overflow:"hidden"}}>
              <div style={{width:Math.min(pen,100)+"%",height:"100%",background:"linear-gradient(90deg,"+UHC_BLUE+","+UHC_GOLD+")",borderRadius:4}}/>
            </div>
          </div>
          <div style={{background:"#0a0f1e",border:"1px solid "+UHC_GOLD+"33",borderRadius:7,padding:"9px 12px"}}>
            <div style={{color:"#fbbf24",fontSize:11,lineHeight:1.5}}>
              💡 With state leads in <strong>{cName}</strong>, agents can add up to <strong style={{color:UHC_GOLD}}>+{fmt(Math.round(eligible*0.03))} new enrollments</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COUNTY MAP ────────────────────────────────────────────────────────────────
function CountyMap({selStates,mode,setMode}){
  const svgRef=useRef(null);
  const cRef=useRef(null);
  const cmsRef=useRef({});
  const modeRef=useRef(mode);
  const[geo,setGeo]=useState(null);
  const[topoOK,setTopoOK]=useState(false);
  const[selC,setSelC]=useState(null);
  const[tip,setTip]=useState(null);
  const[loading,setLoading]=useState(true);
  const[err,setErr]=useState(null);
  const[cms,setCms]=useState({});
  const[cmsLoad,setCmsLoad]=useState(false);
  const[cmsLoaded,setCmsLoaded]=useState(new Set());

  useEffect(()=>{
    if(window.topojson){setTopoOK(true);return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
    s.onload=()=>setTopoOK(true);
    s.onerror=()=>setErr("Could not load map library.");
    document.head.appendChild(s);
  },[]);

  useEffect(()=>{
    if(!topoOK)return;
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json")
      .then(r=>r.json()).then(d=>{setGeo(d);setLoading(false);})
      .catch(()=>{setErr("Could not load county map.");setLoading(false);});
  },[topoOK]);

  // Fetch CMS eligible data - loads states on demand, batches up to 4 at a time
  // Keep refs in sync for D3 event handlers
  useEffect(()=>{cmsRef.current=cms;},[cms]);
  useEffect(()=>{modeRef.current=mode;},[mode]);

  useEffect(()=>{
    if(mode!=="eligible")return;
    // Which states to fetch: selected states (or all 21 if national view, batch 4)
    const wantStates = selStates.length > 0 ? selStates : Object.keys(BOB);
    const toFetch = wantStates.filter(s=>!cmsLoaded.has(s)).slice(0,4);
    if(!toFetch.length)return;
    setCmsLoad(true);
    Promise.all(toFetch.map(st=>{
      const url2025=CMS_URL+"?filter[BENE_GEO_LVL]=County&filter[BENE_STATE_ABRVTN]="+st+"&filter[YEAR]=2025&filter[MONTH]=Year&size=200";
      const url2024=CMS_URL+"?filter[BENE_GEO_LVL]=County&filter[BENE_STATE_ABRVTN]="+st+"&filter[YEAR]=2024&filter[MONTH]=Year&size=200";
      return fetch(url2025).then(r=>r.json()).then(data=>{
        if(Array.isArray(data)&&data.length>0) return {st,data,year:2025};
        return fetch(url2024).then(r=>r.json()).then(data=>({st,data,year:2024}));
      }).catch(()=>({st,data:[],year:2024}));
    })).then(results=>{
      const nd={};
      results.forEach(({st,data})=>{
        if(!Array.isArray(data))return;
        data.forEach(row=>{
          const f5=(row.BENE_FIPS_CD||"").trim();
          if(!f5||f5.length<5)return;
          const eli=parseInt(row.A_B_TOT_BENES)||0;
          const ma=parseInt(row.MA_AND_OTH_BENES)||0;
          nd[f5]={eligible:eli,maEnrolled:ma,ffsGap:Math.max(0,eli-ma),
            pen:eli>0?Math.round(ma/eli*100):0,
            cName:(row.BENE_COUNTY_DESC||"").replace(" County","").trim(),
            st,isLive:true};
        });
      });
      setCms(prev=>Object.assign({},prev,nd));
      setCmsLoaded(prev=>new Set([...prev,...toFetch]));
      setCmsLoad(false);
    });
  },[selStates,mode,cmsLoaded]);

  const maxBob=useMemo(()=>Math.max(...Object.values(FIPS_BOB).map(d=>d.m),1),[]);
  const maxEli=useMemo(()=>{
    const v=Object.values(cms).map(d=>d.eligible).filter(x=>x>0);
    return v.length>0?Math.max(...v):500000;
  },[cms]);

  const bobScale=useMemo(()=>d3.scaleSequential().domain([0,maxBob]).interpolator(t=>{
    if(t<0.001)return"#111827";
    if(t<0.33)return d3.interpolateRgb("#0f2a5e","#0ea5e9")(t/0.33);
    if(t<0.66)return d3.interpolateRgb("#0ea5e9",UHC_GOLD)((t-0.33)/0.33);
    return d3.interpolateRgb(UHC_GOLD,"#dc2626")((t-0.66)/0.34);
  }),[maxBob]);

  const eliScale=useMemo(()=>d3.scaleSequential().domain([0,maxEli]).interpolator(t=>{
    if(t<0.001)return"#071a0f";
    if(t<0.33)return d3.interpolateRgb("#052e16","#16a34a")(t/0.33);
    if(t<0.66)return d3.interpolateRgb("#16a34a","#86efac")((t-0.33)/0.33);
    return d3.interpolateRgb("#86efac","#ffffff")((t-0.66)/0.34);
  }),[maxEli]);

  const mc=mode==="eligible"?ELIGIBLE:ENROLL;


  // ── EFFECT A: Draw map STRUCTURE (paths, borders, labels) ─────────────────
  // Only re-runs when geography or state selection changes - NOT on cms/mode
  useEffect(()=>{
    if(!geo||!svgRef.current||!window.topojson)return;
    const topo=window.topojson;
    const W=cRef.current.clientWidth;
    const selF=new Set((selStates||[]).map(s=>SFIPS[s]).filter(Boolean));
    const allSt=topo.feature(geo,geo.objects.states);
    const allCo=topo.feature(geo,geo.objects.counties);
    const visSt=selF.size>0?{type:"FeatureCollection",features:allSt.features.filter(f=>selF.has(String(f.id).padStart(2,"0")))}:allSt;
    const visCo=selF.size>0?{type:"FeatureCollection",features:allCo.features.filter(f=>selF.has(String(f.id).padStart(5,"0").slice(0,2)))}:allCo;
    const PAD=24;
    const tp=d3.geoAlbersUsa().fitExtent([[0,0],[W,500]],visSt);
    const tp2=d3.geoPath().projection(tp);
    const b=tp2.bounds(visSt);
    const bW=Math.max(b[1][0]-b[0][0],1),bH=Math.max(b[1][1]-b[0][1],1);
    const H=Math.min(Math.max(Math.round(W*(bH/bW))+PAD*2,280),620);
    const svg=d3.select(svgRef.current).attr("width",W).attr("height",H);
    svg.selectAll("*").remove();
    svg.append("rect").attr("width",W).attr("height",H).attr("fill","#040911");
    const proj=d3.geoAlbersUsa().fitExtent([[PAD,PAD],[W-PAD,H-PAD]],visSt);
    const path=d3.geoPath().projection(proj);
    const g=svg.append("g");

    // Draw county paths with placeholder fill - Effect B will color them
    g.selectAll("path.co").data(visCo.features).join("path").attr("class","co")
      .attr("d",path)
      .attr("fill","#0d1117")
      .attr("stroke","#05080f")
      .attr("stroke-width",selF.size===1?0.5:0.25)
      .style("cursor","pointer")
      .on("mouseover",function(event,d){
        const f5=String(d.id).padStart(5,"0");
        const sf=f5.slice(0,2),st=FSMAP[sf]; if(!st)return;
        const r=FIPS_BOB[f5],cr=cmsRef.current[f5];
        const modeNow=modeRef.current;
        const val=modeNow==="eligible"?(cr?cr.eligible:0):(r?r.m:0);
        const cName=cr?cr.cName:(r?r.c:f5);
        const mc=modeNow==="eligible"?ELIGIBLE:ENROLL;
        d3.select(this).attr("stroke",mc).attr("stroke-width",2).raise();
        setTip({x:event.offsetX,y:event.offsetY,f5,st,val,cName,hasCms:!!cr});
      })
      .on("mousemove",function(event){setTip(p=>p?Object.assign({},p,{x:event.offsetX,y:event.offsetY}):null);})
      .on("mouseout",function(){
        const selFSize=new Set((selStates||[]).map(s=>SFIPS[s]).filter(Boolean)).size;
        d3.select(this).attr("stroke","#05080f").attr("stroke-width",selFSize===1?0.5:0.25);
        setTip(null);
      })
      .on("click",function(event,d){
        event.stopPropagation();
        const f5=String(d.id).padStart(5,"0");
        const sf=f5.slice(0,2),st=FSMAP[sf]; if(!st)return;
        const r=FIPS_BOB[f5],cr=cmsRef.current[f5];
        const modeNow=modeRef.current;
        const eli=cr?cr.eligible:Math.round((ELIGIBLE_ST[st]||0)/20);
        const ma=cr?cr.maEnrolled:Math.round(eli*0.55);
        const p=cr?cr.pen:Math.round(ma/Math.max(eli,1)*100);
        const cName=cr?cr.cName:(r?r.c:f5);
        setSelC({fips:f5,county:cName,state:st,bobM:r?r.m:0,
          eligible:eli,maEnrolled:ma,ffsGap:cr?cr.ffsGap:Math.max(0,eli-ma),
          pen:p,agents:BOB[st]?BOB[st].a:0,isLive:!!cr});
      });

    // State borders
    g.append("path").datum(topo.mesh(geo,geo.objects.states,
      selF.size>0?(a,b)=>selF.has(String(a.id).padStart(2,"0"))||selF.has(String(b.id).padStart(2,"0")):(a,b)=>a!==b))
      .attr("fill","none").attr("stroke","#4b6a9a")
      .attr("stroke-width",selF.size<=2?1.4:0.9).attr("d",path);

    // State labels (national view or many states)
    if(selF.size===0||selF.size>6){
      g.selectAll("text.sl").data(visSt.features).join("text").attr("class","sl")
        .attr("transform",d=>{const c=path.centroid(d);return c&&isFinite(c[0])?"translate("+c+")":"translate(-999,-999)";})
        .attr("text-anchor","middle").attr("dy","0.35em")
        .attr("fill","rgba(255,255,255,0.4)").attr("font-size",9)
        .attr("font-family","'DM Sans',sans-serif").attr("font-weight","700")
        .attr("pointer-events","none").text(d=>FSMAP[String(d.id).padStart(2,"0")]||"");
    }

    // County name labels (1-3 states selected)
    if(selF.size>=1&&selF.size<=3){
      const labeled=visCo.features.filter(d=>{
        const f5=String(d.id).padStart(5,"0");
        return FIPS_BOB[f5]||cmsRef.current[f5];
      });
      g.selectAll("text.cl").data(labeled).join("text").attr("class","cl")
        .attr("transform",d=>{const c=path.centroid(d);return c&&isFinite(c[0])?"translate("+c+")":"translate(-999,-999)";})
        .attr("text-anchor","middle").attr("dy","0.35em")
        .attr("fill","rgba(255,255,255,0.92)").attr("font-size",selF.size===1?9:7)
        .attr("font-family","'DM Sans',sans-serif").attr("font-weight","600")
        .attr("pointer-events","none")
        .attr("stroke","#040911").attr("stroke-width","2.5").attr("paint-order","stroke")
        .text(d=>{
          const f5=String(d.id).padStart(5,"0");
          const cr=cmsRef.current[f5],r=FIPS_BOB[f5];
          const n=cr?cr.cName:(r?r.c:"");
          return n.length>11?n.slice(0,10)+"...":n;
        });
    }

    // Gold border on selected states
    if(selF.size>0){
      g.selectAll("path.hl").data(visSt.features).join("path").attr("class","hl")
        .attr("fill","none").attr("stroke",UHC_GOLD).attr("stroke-width",1.5)
        .attr("opacity",0.7).attr("d",path);
    }
  },[geo,selStates,topoOK]);

  // ── EFFECT B: Update county FILL COLORS only (no full redraw) ─────────────
  // Runs whenever mode, cms data, or color scales change
  // This is the key fix: colors update as CMS data streams in
  useEffect(()=>{
    if(!svgRef.current)return;
    const svgEl=d3.select(svgRef.current);
    svgEl.selectAll("path.co").attr("fill",function(){
      const d=d3.select(this).datum();
      if(!d)return"#0d1117";
      const f5=String(d.id).padStart(5,"0");
      const sf=f5.slice(0,2),st=FSMAP[sf];
      if(mode==="eligible"){
        if(cms[f5]&&cms[f5].eligible>0) return eliScale(cms[f5].eligible);
        // Dim proportional fallback while CMS loads
        if(st&&ELIGIBLE_ST[st]){
          const stCo=Object.values(FIPS_BOB).filter(x=>x.s===st).length||12;
          return eliScale(Math.round(ELIGIBLE_ST[st]/Math.max(stCo,12))*0.2);
        }
        return"#071a0f";
      }
      // BOB mode
      const r=FIPS_BOB[f5];
      if(r)return bobScale(r.m);
      return(st&&BOB[st]&&BOB[st].m>0)?"#131d30":"#0d1117";
    });
    // Update stroke highlight color for mode
    const mc=mode==="eligible"?ELIGIBLE:ENROLL;
    svgEl.selectAll("path.co")
      .on("mouseover.color",function(event,d){
        d3.select(this).attr("stroke",mc).attr("stroke-width",2).raise();
      });
  },[mode,cms,eliScale,bobScale]);



  useEffect(()=>{setSelC(null);},[selStates,mode]);

  const leg=mode==="eligible"?"linear-gradient(90deg,#052e16,#16a34a,#86efac,#fff)":"linear-gradient(90deg,#0f2a5e,#0ea5e9,"+UHC_GOLD+",#dc2626)";

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
        <span style={{color:"#475569",fontSize:12,fontWeight:600}}>MAP LAYER:</span>
        {[["bob","📊 BOB Members (by county)",ENROLL],["eligible","🏥 MA-Eligible CMS (LIVE)",ELIGIBLE]].map(([m,label,color])=>(
          <button key={m} onClick={()=>setMode(m)} style={{background:mode===m?color+"22":"#0f172a",border:(mode===m?"2":"1")+"px solid "+(mode===m?color:color+"44"),borderRadius:8,color:mode===m?color:"#475569",padding:"8px 16px",cursor:"pointer",fontSize:13,fontWeight:mode===m?700:400,transition:"all 0.2s"}}>{label}</button>
        ))}
        {cmsLoad&&<span style={{color:ELIGIBLE,fontSize:12}}>⏳ Loading CMS county data...</span>}
        {!cmsLoad&&mode==="eligible"&&<span style={{color:"#334155",fontSize:11,marginLeft:"auto"}}>
          {Object.keys(cms).length > 0 ? "🟢 "+Object.keys(cms).length+" counties loaded from CMS" : "Tap to load CMS data"}
        </span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <span style={{color:"#475569",fontSize:11}}>Low</span>
        <div style={{width:180,height:9,borderRadius:3,background:leg}}/>
        <span style={{color:"#475569",fontSize:11}}>High</span>
        <span style={{color:"#334155",fontSize:11,marginLeft:"auto"}}>
          {selStates.length>0?"Zoom: "+selStates.join(", "):"National View"}
          {selStates.length>0&&selStates.length<=3&&<span style={{color:ELIGIBLE}}>  ·  County labels active</span>}
        </span>
      </div>
      <div ref={cRef} style={{position:"relative",background:"#040911",borderRadius:10,overflow:"hidden",minHeight:280}}>
        {loading&&<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#040911",zIndex:10}}>
          <div style={{width:36,height:36,border:"3px solid #1e293b",borderTop:"3px solid "+mc,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
          <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
          <div style={{color:"#475569",fontSize:13,marginTop:12}}>Loading county map...</div>
        </div>}
        {err&&<div style={{padding:40,textAlign:"center",color:"#ef4444"}}>{err}</div>}
        <svg ref={svgRef} style={{display:"block",width:"100%"}} onClick={()=>setSelC(null)}/>
        {tip&&(
          <div style={{position:"absolute",left:Math.min(tip.x+14,300),top:tip.y-10,background:"#0c1222",border:"1px solid "+mc+"66",borderRadius:9,padding:"10px 14px",pointerEvents:"none",fontSize:12,zIndex:200,boxShadow:"0 8px 24px #00000080",minWidth:190}}>
            <div style={{fontWeight:700,color:"#f1f5f9",fontSize:14,marginBottom:2}}>{tip.cName} County</div>
            <div style={{color:"#64748b",fontSize:11,marginBottom:6}}>{SNAME[tip.st]||tip.st}  ·  FIPS {tip.f5}</div>
            {tip.val>0
              ?<div style={{color:mc,fontWeight:700,fontSize:15}}>
                {mode==="eligible"?fmt(tip.val)+" MA-eligible":fmt(tip.val)+" BOB members"}
                {mode==="eligible"&&!tip.hasCms&&<span style={{color:"#64748b",fontSize:10}}> (loading...)</span>}
               </div>
              :<div style={{color:"#334155",fontSize:11}}>No data  ·  click for details</div>}
            <div style={{color:"#60a5fa",fontSize:10,marginTop:4}}>Click for full county details</div>
          </div>
        )}
        <CPanel county={selC} mode={mode} onClose={()=>setSelC(null)}/>
      </div>
      <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <BobBadge/><CmsBadge live={true}/>
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
const USERS = [
  {email:"wmartinez@allcaremar.com",  pass:"WM123",         name:"Waldo Martinez",    agency:null,               type:"admin"},
  {email:"mrodriguez@allcaremar.com", pass:"Allcare12345",  name:"Marcos Rodriguez",  agency:null,               type:"admin"},
  {email:"msanti@allcaremar.com",     pass:"Allcare12345",  name:"Maria Santiago",    agency:null,               type:"admin"},
  {email:"abreja@allcaremar.com",     pass:"JC123",         name:"Jesus Cabreja",     agency:null,               type:"admin"},
  {email:"anamichelle@allcaremar.com",pass:"Amc12345",      name:"Ana Christopher",   agency:"AMC Care Group",   type:"director"},
  {email:"henryc@allcaremar.com",     pass:"Concep12345",   name:"Henry Concepcion",  agency:"Concep Care",      type:"director"},
  {email:"glendahealthagent@gmail.com",pass:"Gw12345",      name:"Glenda Colon",      agency:"GW Ins Group",     type:"director"},
  {email:"julian_vega@allcaremar.com",pass:"Jpm12345",      name:"Julian Vega",       agency:"JPM Solutions",    type:"director"},
  {email:"rpinzon@allcaremar.com",    pass:"Kmra12345",     name:"Roland Pinzon",     agency:"KMRA Group",       type:"director"},
  {email:"amartell@allcaremar.com",   pass:"Martell12345",  name:"Ana Martell",       agency:"Martell Multi",    type:"director"},
  {email:"nikols@allcaremar.com",     pass:"Simarova12345", name:"Nikol Simarova",    agency:"Simarova Senior",  type:"director"},
  {email:"sclark@allcaremar.com",     pass:"Tcs12345",      name:"Sara Clark",        agency:"TCS & Associates", type:"director"},
  {email:"pgalarza@allcaremar.com",   pass:"Top12345",      name:"Priscilla Galarza", agency:"Top Tier Health",  type:"director"},
];

export default function Dashboard(){
  const [authUser,       setAuthUser]       = useState(null);
  const [needsPwdChange, setNeedsPwdChange] = useState(false);
  const [loginEmail,     setLoginEmail]     = useState("");
  const [loginPass,      setLoginPass]      = useState("");
  const [loginError,     setLoginError]     = useState("");
  const [forgotMode,     setForgotMode]     = useState(false);
  const [forgotEmail,    setForgotEmail]    = useState("");
  const [forgotMsg,      setForgotMsg]      = useState("");
  const [newPwd,         setNewPwd]         = useState("");
  const [confirmPwd,     setConfirmPwd]     = useState("");
  const [pwdError,       setPwdError]       = useState("");

  const doForgot = () => {
    const u = USERS.find(x => x.email.toLowerCase() === forgotEmail.toLowerCase().trim());
    if (!u) { setForgotMsg("Email not found. Contact your administrator."); return; }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("acm_pw_"+u.email);
      localStorage.removeItem("acm_ch_"+u.email);
    }
    setForgotMsg("Password reset. Log in with your temporary password.");
  };
  const doLogin = () => {
    const u = USERS.find(x => x.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (!u) { setLoginError("Invalid email or password."); return; }
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("acm_pw_"+u.email) : null;
    if ((saved||u.pass) !== loginPass) { setLoginError("Invalid email or password."); return; }
    if (typeof localStorage !== "undefined") localStorage.setItem("acm_sess", JSON.stringify({email:u.email,name:u.name,agency:u.agency,type:u.type}));
    setAuthUser(u);
    if (u.type==="director") setSelAgency(u.agency);
    const changed = typeof localStorage !== "undefined" ? localStorage.getItem("acm_ch_"+u.email) : null;
    if (!changed) setNeedsPwdChange(true);
  };
  const doSavePwd = () => {
    if (newPwd.length < 8) { setPwdError("Min. 8 characters."); return; }
    if (newPwd !== confirmPwd) { setPwdError("Passwords do not match."); return; }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("acm_pw_"+authUser.email, newPwd);
      localStorage.setItem("acm_ch_"+authUser.email, "1");
    }
    setNeedsPwdChange(false);
  };
  const doLogout = () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem("acm_sess");
    setAuthUser(null); setNeedsPwdChange(false); setSelAgency(null); setSel([]);
    setLoginEmail(""); setLoginPass(""); setLoginError("");
  };
  const allAgencies = AGENCIES;
  const [selAgency, setSelAgency] = useState(null); // null = All Agencies

  // When agency selected, available states = that agency's states; else all
  const allSt = selAgency
    ? (AGENCY_DATA[selAgency] ? AGENCY_DATA[selAgency].states : Object.keys(BOB))
    : Object.keys(BOB).sort((a,b)=>BOB[b].m-BOB[a].m);

  const[sel,setSel]=useState([]);
  const[tab,setTab]=useState("bob");
  const[mode,setMode]=useState("bob");

  // Reset state filter when agency changes
  const handleAgencyChange = (agency) => {
    setSelAgency(agency);
    setSel([]); // reset state filter
  };

  const active = sel.length>0 ? sel : allSt;

  // Active dataset - either agency-specific or global
  const AD = selAgency && AGENCY_DATA[selAgency] ? AGENCY_DATA[selAgency] : null;
  const activeBOB      = AD ? AD.bobState         : BOB;
  const activeAPS      = AD ? AD.aps               : AGENTS_PER_STATE;
  const activePlans    = AD ? AD.plans             : null; // null = use PLANS_BY_STATE
  const activeMonthly  = AD ? AD.monthly           : null; // null = use MONTHLY_BY_STATE
  const activeAgents   = AD ? AD.agents            : AGENTS_TOTAL;

  const kpis=useMemo(()=>{
    const tm = active.reduce((a,s)=>a+(activeBOB[s]?activeBOB[s].m:0),0);
    const tl = active.reduce((sum,s)=>sum+(activeAPS[s]||0),0);
    const agSrc = activeAgents || AGENTS_TOTAL;
    const ta = (sel.length===0 && !selAgency)
      ? 129  // total unique agents across all 21 states
      : new Set(agSrc.filter(a=>a.ss.some(s=>active.includes(s))).map(a=>a.n)).size;
    const te = active.reduce((a,s)=>a+(ELIGIBLE_ST[s]||0),0);
    return{tm,ta,tl,te,pen:te>0?(tm/te*100).toFixed(2):"0"};
  },[active,sel,selAgency,activeBOB,activeAPS,activeAgents]);

  const bars=useMemo(()=>active.map(s=>({state:s,members:activeBOB[s]?activeBOB[s].m:0,agents:activeBOB[s]?activeBOB[s].a:0,elig:Math.round((ELIGIBLE_ST[s]||0)/1000)})).sort((a,b)=>b.members-a.members),[active,activeBOB]);

  // Dynamic enrollment periods filtered by active states
  const periodsData=useMemo(()=>{
    const MONTH_KEYS=[
      {key:"2026-01",label:"Jan '26",t:"AEP"},
      {key:"2026-02",label:"Feb '26",t:"SEP"},
      {key:"2026-03",label:"Mar '26",t:"SEP"},
      {key:"2026-04",label:"Apr '26",t:"SEP"},
      {key:"2026-05",label:"May '26",t:"SEP"},
      {key:"2026-06",label:"Jun '26",t:"SEP"},
    ];
    const mSrc2=activeMonthly||MONTHLY_BY_STATE;
    return MONTH_KEYS.map(mo=>({
      p:mo.label,
      m:active.reduce((sum,s)=>sum+((mSrc2[s]&&mSrc2[s][mo.key])||0),0),
      t:mo.t
    })).filter(d=>d.m>0);
  },[active]);

  // Dynamic top plans filtered by active states - aggregate across states
  const plansData=useMemo(()=>{
    const planMap={};
    const plSrc=activePlans||PLANS_BY_STATE;
    active.forEach(s=>{
      (plSrc[s]||[]).forEach(({p,m})=>{
        planMap[p]=(planMap[p]||0)+m;
      });
    });
    return Object.entries(planMap)
      .map(([p,m])=>({p,m}))
      .sort((a,b)=>b.m-a.m)
      .slice(0,8);
  },[active]);

  // ── CMS data at Dashboard level for Opportunity tab ──────────────────────────
  const [dashCms, setDashCms] = useState({});
  const [dashCmsLoaded, setDashCmsLoaded] = useState(new Set());
  const [dashCmsLoading, setDashCmsLoading] = useState(false);

  // Auto-fetch CMS for active states when on opportunity tab
  useEffect(()=>{
    if(tab !== "opportunity") return;
    const toFetch = active.filter(s => !dashCmsLoaded.has(s));
    if(!toFetch.length) return;
    setDashCmsLoading(true);
    Promise.all(toFetch.map(st => {
      const url2025 = CMS_URL+"?filter[BENE_GEO_LVL]=State&filter[BENE_STATE_ABRVTN]="+st+"&filter[YEAR]=2025&filter[MONTH]=Year&size=5";
      const url2024 = CMS_URL+"?filter[BENE_GEO_LVL]=State&filter[BENE_STATE_ABRVTN]="+st+"&filter[YEAR]=2024&filter[MONTH]=Year&size=5";
      return fetch(url2025).then(r=>r.json()).then(data=>{
        if(Array.isArray(data)&&data.length>0) return {st,data,year:2025};
        return fetch(url2024).then(r=>r.json()).then(data=>({st,data,year:2024}));
      }).catch(()=>({st,data:[],year:2024}));
    })).then(results => {
      const nd = {};
      results.forEach(({st,data})=>{
        if(!Array.isArray(data)) return;
        const row = data.find(r=>r.BENE_GEO_LVL==="State"||r.BENE_STATE_ABRVTN===st);
        if(row){
          const eli = parseInt(row.A_B_TOT_BENES)||0;
          const ma  = parseInt(row.MA_AND_OTH_BENES)||0;
          nd[st] = {
            eligible: eli,
            maEnrolled: ma,
            ffsGap: Math.max(0, eli-ma),
            penetration: eli>0 ? (ma/eli*100).toFixed(1) : "0",
            isLive: true,
            year: results.find(r=>r.st===st).year||2024||2024
          };
        }
      });
      setDashCms(prev => Object.assign({},prev,nd));
      setDashCmsLoaded(prev => new Set([...prev,...toFetch]));
      setDashCmsLoading(false);
    });
  },[tab, active]);

  // Opportunity data - live CMS if available, BOB estimates as fallback
  const oppData = useMemo(()=>{
    return active.map(s => {
      const cms  = dashCms[s];
      const bobM = BOB[s] ? BOB[s].m : 0;
      const eli  = cms ? cms.eligible  : (ELIGIBLE_ST[s]||0);
      const ma   = cms ? cms.maEnrolled: Math.round(eli*0.55);
      const ffs  = cms ? cms.ffsGap    : Math.max(0, eli-ma);
      const pen  = cms ? parseFloat(cms.penetration) : (eli>0?+(bobM/eli*100).toFixed(1):0);
      return {
        state: s,
        bobM,
        eligible: eli,
        maEnrolled: ma,
        ffsGap: ffs,
        penetration: pen,
        potential: Math.round(ffs * 0.03),
        isLive: !!cms,
        elig000: Math.round(eli/1000),
      };
    }).sort((a,b)=>b.ffsGap-a.ffsGap);
  },[active, dashCms]);

  // === RETENTION DATA processing - respects filters ===
  const retentionData = useMemo(function(){
    // selAgency ya es el short name (e.g. "AllCare Mar") que coincide con RETENTION_DATA.byAgency
    var selAgencyShort = selAgency || null;
    var stateFilter = sel.length > 0 ? sel : null;

    // Decidir que dataset usar segun filtros
    var rows;
    if (selAgencyShort && !stateFilter) {
      // Solo filtro agencia - usar byAgency
      rows = RETENTION_DATA.byAgency.filter(function(r){ return r.agency === selAgencyShort; });
    } else if (stateFilter && !selAgencyShort) {
      // Solo filtro estado - agregar byState para los estados seleccionados
      var bySnap = {};
      RETENTION_DATA.byState.forEach(function(r){
        if (stateFilter.indexOf(r.state) === -1) return;
        if (!bySnap[r.snap]) bySnap[r.snap] = {snap:r.snap, total:0, retained:0, "new":0, winback:0, churned:0, prev:0};
        bySnap[r.snap].total += r.total;
        bySnap[r.snap].retained += r.retained;
        bySnap[r.snap]["new"] += r["new"];
        bySnap[r.snap].winback += r.winback;
        bySnap[r.snap].churned += r.churned;
        // retRate requires prev - compute later
      });
      rows = RETENTION_DATA.snapshots.map(function(snap){
        var d = bySnap[snap] || {snap:snap, total:0, retained:0, "new":0, winback:0, churned:0};
        var denom = d.retained + d.churned;
        d.retRate = denom > 0 ? +((d.retained / denom) * 100).toFixed(2) : null;
        return d;
      });
    } else if (selAgencyShort && stateFilter) {
      // Ambos filtros - no tenemos precalculo agency+state, usar solo agencia
      rows = RETENTION_DATA.byAgency.filter(function(r){ return r.agency === selAgencyShort; });
    } else {
      // Sin filtros - global
      rows = RETENTION_DATA.global;
    }

    // Ordenar por snap
    rows = rows.slice().sort(function(a,b){ return a.snap < b.snap ? -1 : 1; });

    // KPIs agregados del ultimo periodo valido (excluir el primer snap que no tiene comparacion)
    var validRows = rows.filter(function(r){ return r.retRate !== null && r.retRate !== undefined; });
    var lastRow = validRows.length > 0 ? validRows[validRows.length - 1] : null;
    var avgRet = validRows.length > 0 ? validRows.reduce(function(a,r){ return a + r.retRate; }, 0) / validRows.length : 0;
    var totalChurned = rows.reduce(function(a,r){ return a + (r.churned || 0); }, 0);
    var totalWinback = rows.reduce(function(a,r){ return a + (r.winback || 0); }, 0);
    var totalNew = rows.reduce(function(a,r){ return a + (r["new"] || 0); }, 0);
    var currentActive = rows.length > 0 ? rows[rows.length - 1].total : 0;

    // Tenure data
    var tenureRows;
    if (selAgencyShort) {
      tenureRows = RETENTION_DATA.tenureByAgency.filter(function(r){ return r.agency === selAgencyShort; });
    } else if (stateFilter) {
      var tenMap = {};
      RETENTION_DATA.tenureByState.forEach(function(r){
        if (stateFilter.indexOf(r.state) === -1) return;
        tenMap[r.bucket] = (tenMap[r.bucket] || 0) + r.count;
      });
      tenureRows = Object.keys(tenMap).map(function(b){ return {bucket:b, count:tenMap[b]}; });
    } else {
      tenureRows = Object.keys(RETENTION_DATA.tenureGlobal).map(function(b){
        return {bucket:b, count:RETENTION_DATA.tenureGlobal[b]};
      });
    }
    var bucketOrder = ["0-3 mo","3-6 mo","6-12 mo","1-2 yr","2-3 yr","3+ yr","Unknown"];
    tenureRows = bucketOrder.map(function(b){
      var found = tenureRows.filter(function(r){ return r.bucket === b; });
      var cnt = found.reduce(function(a,r){ return a + r.count; }, 0);
      return {bucket:b, count:cnt};
    }).filter(function(r){ return r.count > 0; });

    // Por agencia ranking (solo cuando no hay agencia seleccionada)
    var agencyRanking = null;
    if (!selAgencyShort) {
      var ag = {};
      RETENTION_DATA.byAgency.forEach(function(r){
        if (r.retRate === null || r.retRate === undefined) return;
        if (!ag[r.agency]) ag[r.agency] = {agency:r.agency, totalRet:0, count:0, members:0, churned:0, winback:0};
        ag[r.agency].totalRet += r.retRate;
        ag[r.agency].count += 1;
        ag[r.agency].churned += r.churned;
        ag[r.agency].winback += r.winback;
      });
      // members: usar ultimo snapshot
      var lastSnap = RETENTION_DATA.snapshots[RETENTION_DATA.snapshots.length - 1];
      RETENTION_DATA.byAgency.forEach(function(r){
        if (r.snap === lastSnap && ag[r.agency]) ag[r.agency].members = r.total;
      });
      agencyRanking = Object.keys(ag).map(function(k){
        var a = ag[k];
        return {agency:k, avgRetRate:+(a.totalRet/a.count).toFixed(2), members:a.members, churned:a.churned, winback:a.winback};
      }).sort(function(a,b){ return b.members - a.members; });
    }

    return {
      rows: rows,
      avgRet: +avgRet.toFixed(2),
      lastRet: lastRow ? lastRow.retRate : 0,
      totalChurned: totalChurned,
      totalWinback: totalWinback,
      totalNew: totalNew,
      currentActive: currentActive,
      tenureRows: tenureRows,
      agencyRanking: agencyRanking
    };
  }, [selAgency, sel]);


  const TABS=[["bob","📋 Book of Business"],["map","🗺 County Map"],["zip","📍 Zip Heatmap"],["agents","🏆 Top Agents"],["opportunity","💡 Opportunity"],["retention","🔄 Retention"],["actionplan","🎯 Action Plan"]];

  if (!authUser) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020817,#0a1628)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:16,padding:"40px 44px",width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <img src={LOGO} alt="AllCare Mar" style={{height:48,background:"#fff",borderRadius:8,padding:"4px 12px",objectFit:"contain"}}/>
          <p style={{color:"#475569",fontSize:12,margin:"8px 0 0"}}>Agency Performance Portal</p>
        </div>
        <h2 style={{margin:"0 0 20px",color:"#f1f5f9",fontSize:19,fontWeight:700,textAlign:"center"}}>Sign In</h2>
        <div style={{marginBottom:12}}>
          <div style={{color:"#94a3b8",fontSize:11,textTransform:"uppercase",marginBottom:5}}>Email</div>
          <input type="email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="you@allcaremar.com" style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:7,padding:"10px 13px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{color:"#94a3b8",fontSize:11,textTransform:"uppercase",marginBottom:5}}>Password</div>
          <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="Password" style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:7,padding:"10px 13px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        {loginError&&<div style={{background:"#450a0a",borderRadius:7,padding:"9px 13px",color:"#fca5a5",fontSize:13,marginBottom:14}}>{loginError}</div>}
        <button onClick={doLogin} style={{width:"100%",background:UHC_BLUE,border:"none",borderRadius:7,padding:"12px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>Sign In</button>
        {!forgotMode&&<button onClick={()=>{setForgotMode(true);setForgotMsg("");}} style={{width:"100%",background:"transparent",border:"none",color:"#475569",fontSize:12,cursor:"pointer",marginTop:10,textDecoration:"underline"}}>Forgot Password?</button>}
        {forgotMode&&(<div style={{marginTop:16,borderTop:"1px solid #1e293b",paddingTop:16}}>
          <div style={{color:"#94a3b8",fontSize:12,marginBottom:8,fontWeight:600}}>Reset Password</div>
          <input type="email" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)} placeholder="Enter your email" style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:7,padding:"10px 13px",color:"#f1f5f9",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
          {forgotMsg&&<div style={{padding:"9px 13px",borderRadius:7,fontSize:12,marginBottom:8,background:forgotMsg.includes("reset")?"#052e16":"#450a0a",color:forgotMsg.includes("reset")?"#4ade80":"#fca5a5"}}>{forgotMsg}</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={doForgot} style={{flex:1,background:UHC_GOLD,border:"none",borderRadius:7,padding:"10px",color:UHC_BLUE,fontSize:13,fontWeight:700,cursor:"pointer"}}>Reset</button>
            <button onClick={()=>{setForgotMode(false);setForgotMsg("");setForgotEmail("");}} style={{flex:1,background:"#1e293b",border:"none",borderRadius:7,padding:"10px",color:"#94a3b8",fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>)}
        <p style={{textAlign:"center",color:"#334155",fontSize:11,marginTop:16}}>ACM Agency Portal</p>
      </div>
    </div>
  );


  if (needsPwdChange) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#020817,#0a1628)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0f172a",border:"1px solid #f5a80055",borderRadius:16,padding:"40px 44px",width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <img src={LOGO} alt="AllCare Mar" style={{height:44,background:"#fff",borderRadius:8,padding:"4px 12px",objectFit:"contain"}}/>
          <h2 style={{margin:"14px 0 4px",color:"#f1f5f9",fontSize:18,fontWeight:700}}>Create Your Password</h2>
          <p style={{margin:0,color:"#475569",fontSize:13}}>Hi {authUser&&authUser.name.split(" ")[0]}! Set a personal password.</p>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{color:"#94a3b8",fontSize:11,textTransform:"uppercase",marginBottom:5}}>New Password</div>
          <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="Min. 8 characters" style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:7,padding:"10px 13px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{color:"#94a3b8",fontSize:11,textTransform:"uppercase",marginBottom:5}}>Confirm Password</div>
          <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSavePwd()} placeholder="Repeat password" style={{width:"100%",background:"#020817",border:"1px solid #1e293b",borderRadius:7,padding:"10px 13px",color:"#f1f5f9",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        {pwdError&&<div style={{background:"#450a0a",borderRadius:7,padding:"9px 13px",color:"#fca5a5",fontSize:13,marginBottom:14}}>{pwdError}</div>}
        <button onClick={doSavePwd} style={{width:"100%",background:UHC_GOLD,border:"none",borderRadius:7,padding:"12px",color:UHC_BLUE,fontSize:15,fontWeight:700,cursor:"pointer"}}>Save Password</button>
      </div>
    </div>
  );


  const user = authUser;

  return(
    <div style={{background:"#020817",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f1f5f9"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet"/>
      <style>{".recharts-legend-item-text{color:#f1f5f9!important} .recharts-legend-item text{fill:#f1f5f9!important}"}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(135deg,"+UHC_BLUE+",#001a5e)",padding:"14px 24px",borderBottom:"2px solid "+UHC_GOLD}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <img src={LOGO} alt="AllCare Mar" style={{height:52,width:"auto",objectFit:"contain",background:"#ffffff",borderRadius:8,padding:"4px 10px"}}/>
            <div style={{width:1,height:40,background:"#ffffff20"}}/>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{background:UHC_GOLD,borderRadius:6,padding:"3px 10px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:UHC_BLUE,fontSize:12}}>UHC  ·  IMO Partner</div>
                <h1 style={{margin:0,fontSize:17,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#fff"}}>Agency Growth Dashboard</h1>
              </div>
              <p style={{margin:"3px 0 0",color:"#93c5fd",fontSize:11}}>State Director Presentation  ·  Medicare Advantage  ·  BOB as of 04-28-2026</p>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            {user&&user.type==="admin"&&<AgencyFilter agencies={allAgencies} selected={selAgency} onChange={handleAgencyChange}/>}
            <StateSel states={allSt} sel={sel} onChange={setSel}/>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,padding:"6px 12px"}}>
              <div>
                <div style={{color:"#f1f5f9",fontSize:12,fontWeight:600}}>{user&&user.name}</div>
                <div style={{color:"#475569",fontSize:10}}>{user&&user.type==="admin"?"Admin":"Director"}{user&&user.agency?"  ·  "+user.agency:""}</div>
              </div>
              <button onClick={doLogout} style={{background:"#1e293b",border:"none",borderRadius:6,color:"#94a3b8",cursor:"pointer",padding:"5px 10px",fontSize:11,marginLeft:4}}>Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:"18px 24px"}}>
        <div style={{marginBottom:8,color:"#334155",fontSize:11}}>
          💡 Tap <span style={{color:ENROLL,fontWeight:700}}>BOB Members</span> or <span style={{color:ELIGIBLE,fontWeight:700}}>CMS Eligible</span> cards to view on the county map  ·  Auto-zooms to selected states  ·  Click any county for details
        </div>

        {/* KPIs */}
        <div style={{display:"flex",gap:11,flexWrap:"wrap",marginBottom:18}}>
          <KpiCard label="Active BOB Members" value={kpis.tm.toLocaleString()} sub="Real UHC Book of Business  ·  776 counties" accent="#a78bfa" icon="👥" clickable active={mode==="bob"&&tab==="map"} onClick={()=>{setMode("bob");setTab("map");}}/>
          <KpiCard label="Licensed Agents"
            value={kpis.ta}
            sub={
              sel.length===1
                ? kpis.tl+" licenses  ·  "+(SNAME[sel[0]]||sel[0])
                : kpis.tl+" total licenses  ·  "+active.length+" states"
            }
            accent="#0ea5e9" icon="🤝"/>
          <KpiCard label="MA-Eligible (CMS)" value={fmt(kpis.te)} sub="Source: CMS Enrollment 2024" accent={ELIGIBLE} icon="🏥" clickable active={mode==="eligible"&&tab==="map"} onClick={()=>{setMode("eligible");setTab("map");}}/>
          <KpiCard label="States" value={Object.keys(BOB).length} sub="National footprint" accent={UHC_GOLD} icon="🗺"/>
          <KpiCard label="Market Penetration" value={kpis.pen+"%"} sub="BOB members vs CMS eligible" accent="#f97316" icon="🎯"/>
        </div>

        {/* TABS */}
        <div style={{display:"flex",marginBottom:18,borderBottom:"1px solid #1e293b",overflowX:"auto"}}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:"none",border:"none",cursor:"pointer",color:tab===id?UHC_GOLD:"#475569",fontSize:13,fontWeight:tab===id?700:400,padding:"10px 18px",whiteSpace:"nowrap",borderBottom:tab===id?"2px solid "+UHC_GOLD:"2px solid transparent",transition:"all 0.2s"}}>{label}</button>
          ))}
        </div>

        {/* BOB TAB */}
        {tab==="bob"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
              {bars.slice(0,10).map((s,i)=>{
                const pen=(s.members/(ELIGIBLE_ST[s.state]||1)*100).toFixed(2);
                const stCo=Object.values(FIPS_BOB).filter(d=>d.s===s.state);


                return(
                  <div key={s.state} style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid "+CLRS[i%CLRS.length]+"33"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18,color:"#f1f5f9"}}>{s.state}</div>
                        <div style={{color:"#475569",fontSize:11}}>{SNAME[s.state]}</div>
                      </div>
                      <div style={{background:CLRS[i%CLRS.length]+"22",borderRadius:5,padding:"2px 7px",color:CLRS[i%CLRS.length],fontWeight:700,fontSize:11}}>{pen}%</div>
                    </div>
                    {[["👥 BOB Members",fmt(s.members),"#a78bfa"],["🏛 Counties w/ BOB",stCo.length,"#0ea5e9"],["🤝 Agents",s.agents,"#10b981"],["🏥 CMS Eligible",fmt(ELIGIBLE_ST[s.state]||0),ELIGIBLE]].map(([l,v,c])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{color:"#475569",fontSize:11}}>{l}</span>
                        <span style={{color:c,fontWeight:700,fontSize:13}}>{v}</span>
                      </div>
                    ))}
                    <div style={{marginTop:8,background:"#1e293b",borderRadius:4,height:5,overflow:"hidden"}}>
                      <div style={{width:Math.min(parseFloat(pen)*10,100)+"%",background:"linear-gradient(90deg,"+CLRS[i%CLRS.length]+","+UHC_GOLD+")",height:"100%",borderRadius:4}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MONTHLY GROWTH CHART */}
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid "+UHC_GOLD+"44"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <h3 style={{margin:0,fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>📈 Enrollment Growth - 2026</h3>
                  <p style={{margin:"3px 0 0",color:"#475569",fontSize:11}}>New enrollments per month + running total  ·  AEP vs SEP</p>
                </div>
                <div style={{display:"flex",gap:16,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,background:UHC_GOLD,borderRadius:2}}/><span style={{color:"#94a3b8",fontSize:11}}>AEP (Jan)</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:12,height:12,background:"#3b82f6",borderRadius:2}}/><span style={{color:"#94a3b8",fontSize:11}}>SEP</span></div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:28,height:3,background:ELIGIBLE,borderRadius:2}}/><span style={{color:"#94a3b8",fontSize:11}}>Cumulative</span></div>
                </div>
              </div>
              {(()=>{
                // Full history - all months from CHART_MONTHS
                let cumulative=0;
                const chartData=CHART_MONTHS.map(mo=>{
                  const mSrc=activeMonthly||MONTHLY_BY_STATE;
                  const newM=active.reduce((sum,s)=>sum+(mSrc[s]&&mSrc[s][mo.key]?mSrc[s][mo.key]:0),0);
                  cumulative+=newM;
                  return{month:mo.label,new:newM,cum:cumulative,type:mo.type};
                }).filter(d=>d.new>0);
                const totalAEP=chartData.filter(d=>d.type==="AEP").reduce((sum,d)=>sum+d.new,0);
                const totalSEP=chartData.filter(d=>d.type==="SEP").reduce((sum,d)=>sum+d.new,0);
                const totalAll=totalAEP+totalSEP;
                return(<>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={chartData} margin={{top:5,right:30,left:0,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                      <XAxis dataKey="month" tick={{fill:"#94a3b8",fontSize:11}} axisLine={{stroke:"#1e293b"}}/>
                      <YAxis yAxisId="left" tick={{fill:"#64748b",fontSize:10}} axisLine={{stroke:"#1e293b"}} tickFormatter={fmt}/>
                      <YAxis yAxisId="right" orientation="right" tick={{fill:"#64748b",fontSize:10}} axisLine={{stroke:"#1e293b"}} tickFormatter={fmt}/>
                      <Tooltip
                        contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8}}
                        labelStyle={{color:UHC_GOLD,fontWeight:700}}
                        formatter={(v,n)=>n==="cum"?[v.toLocaleString(),"Cumulative Total"]:[v.toLocaleString(),"New Enrollments"]}
                      />
                      <Bar yAxisId="left" dataKey="new" name="new" radius={[4,4,0,0]}>
                        {chartData.map((e,i)=>(<Cell key={i} fill={e.type==="AEP"?UHC_GOLD:"#3b82f6"}/>))}
                      </Bar>
                      <Line yAxisId="right" type="monotone" dataKey="cum" name="cum" stroke={ELIGIBLE} strokeWidth={2.5} dot={{fill:ELIGIBLE,r:4}} activeDot={{r:6}}/>
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",gap:24,marginTop:10,flexWrap:"wrap"}}>
                    {[[totalAEP.toLocaleString(),"AEP Jan 2026","#f59e0b"],[totalSEP.toLocaleString(),"SEP (Feb-Jun)","#3b82f6"],[totalAll.toLocaleString(),"Total Members","#a78bfa"]].map(([v,l,c])=>(
                      <div key={l} style={{display:"flex",flexDirection:"column",gap:2}}>
                        <span style={{color:c,fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:18}}>{v}</span>
                        <span style={{color:"#475569",fontSize:10}}>{l}</span>
                      </div>
                    ))}
                  </div>
                </>);
              })()}
            </div>
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <h3 style={{margin:0,fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:14}}>📊 Active Members by State - Real BOB Data</h3>
                <BobBadge/>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={bars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="state" tick={{fill:"#94a3b8",fontSize:11}} axisLine={{stroke:"#1e293b"}}/>
                  <YAxis tick={{fill:"#64748b",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                  <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8}} labelStyle={{color:UHC_GOLD}} formatter={(v,n)=>[v.toLocaleString(),n]}/>
                  <Legend wrapperStyle={{fontSize:11}} itemStyle={{color:"#f1f5f9"}}/>
                  <Bar dataKey="members" fill="#8b5cf6" radius={[4,4,0,0]} name="BOB Members"/>
                  <Bar dataKey="agents" fill={UHC_GOLD} radius={[4,4,0,0]} name="Agents"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b",flex:"1 1 280px"}}>
                <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:14}}>📅 Enrollment by Period</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={periodsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="p" tick={{fill:"#64748b",fontSize:9}} axisLine={{stroke:"#1e293b"}}/>
                    <YAxis tick={{fill:"#64748b",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                    <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8}} formatter={(v)=>[v.toLocaleString(),"Members"]}/>
                    <Bar dataKey="m" radius={[4,4,0,0]} name="Members">
                      {periodsData.map((e,i)=>(<Cell key={i} fill={e.t==="AEP"?UHC_GOLD:UHC_BLUE}/>))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{display:"flex",gap:10,fontSize:11,color:"#64748b",marginTop:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,background:UHC_GOLD,borderRadius:2}}/> AEP 2025-26</div>
                  <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,background:UHC_BLUE,borderRadius:2}}/> SEP</div>
                </div>
              </div>
              <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b",flex:"1 1 280px"}}>
                <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:14}}>🏆 Top Plans by Members</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={plansData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false}/>
                    <XAxis type="number" tick={{fill:"#64748b",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                    <YAxis dataKey="p" type="category" tick={{fill:"#94a3b8",fontSize:8}} width={130} axisLine={{stroke:"#1e293b"}}/>
                    <Tooltip contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8}} formatter={(v)=>[v.toLocaleString(),"Members"]}/>
                    <Bar dataKey="m" fill={ELIGIBLE} radius={[0,4,4,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {tab==="map"&&(
          <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:12}}>
              <div>
                <h3 style={{margin:"0 0 3px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>🗺 Interactive County Map - Real BOB Data</h3>
                <p style={{margin:0,color:"#475569",fontSize:12}}>776 counties colored by real BOB members  ·  Select 1-3 states to see county names  ·  Click any county for details</p>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><BobBadge/><CmsBadge live={true}/></div>
            </div>
            <CountyMap selStates={active} mode={mode} setMode={setMode}/>
          </div>
        )}


        {/* ZIP HEATMAP TAB */}
        {tab==="zip"&&(
          <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:4}}>
              <h3 style={{margin:0,fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>📍 Zip Code Heatmap - Real BOB Data  ·  4,240 zip codes</h3>
              <BobBadge/>
            </div>
            <p style={{color:"#475569",fontSize:12,marginBottom:12}}>Top 20 zip codes per state  ·  Each zip shows its county  ·  Source: ACM_BOB_04-28-2026.xlsx</p>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {[["#1e40af","Low"],["#0ea5e9","Medium"],["#d97706","High"],["#ea580c","Very High"],["#b91c1c","Maximum"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                  <div style={{width:12,height:12,background:c,borderRadius:3}}/>
                  <span style={{color:"#64748b",fontSize:10}}>{l}</span>
                </div>
              ))}
            </div>
            {active.filter(st=>BOB_ZIP[st]).map(state=>{
              const zips=BOB_ZIP[state]||[];
              const maxM=Math.max(...zips.map(z=>z.m),1);
              return(
                <div key={state} style={{marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{background:UHC_BLUE,borderRadius:5,padding:"2px 9px",fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#fff",fontSize:12}}>{state}</div>
                    <span style={{color:"#64748b",fontSize:11}}>
                      <strong style={{color:"#a78bfa"}}>{fmt(BOB[state]?BOB[state].m:0)} BOB members</strong>
                      {"  ·  "}{BOB[state]?BOB[state].a:0} agents
                      {"  ·  "}<span style={{color:ELIGIBLE}}>{fmt(ELIGIBLE_ST[state]||0)} CMS eligible</span>
                    </span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                    {zips.map(z=>(
                      <div key={z.zip}
                        style={{background:heat(z.m/maxM),borderRadius:8,padding:"8px 12px",minWidth:110,transition:"transform 0.15s",cursor:"default"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.07)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                      >
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:"#fff",fontSize:13}}>{z.zip}</div>
                        <div style={{color:"rgba(255,255,255,0.9)",fontSize:10,fontWeight:600}}>{z.city}</div>
                        <div style={{color:"rgba(255,255,255,0.6)",fontSize:9,marginBottom:3}}>{z.county} County</div>
                        <div style={{color:"#fff",fontSize:16,fontWeight:700}}>{z.m}</div>
                        <div style={{color:"rgba(255,255,255,0.6)",fontSize:9}}>members</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* AGENTS TAB */}
        {tab==="agents"&&(()=>{
          // When states filtered: re-sum each agent's members for selected states only
          const filteredAgents = (() => {
            const agSrc = activeAgents || AGENTS_TOTAL;
            // No state filter: just take top 15 from agency-filtered source
            if(sel.length === 0) {
              return agSrc.slice().sort((a,b) => b.m-a.m).slice(0,15);
            }
            // With state filter: re-sum each agent's members for selected states only
            return agSrc
              .map(a => {
                const stateM = sel.reduce((sum,s) => sum + (a.bs[s]||0), 0);
                return {...a, m: stateM, filtStates: sel.filter(s => a.bs[s]>0)};
              })
              .filter(a => a.m > 0)
              .sort((a,b) => b.m-a.m)
              .slice(0,15);
          })();
          const stateAgentCount = active.map(s=>({
            state:s,
            count: (activeAgents||AGENTS_TOTAL).filter(a=>a.ss.includes(s)).length,
            top: (activeAgents||AGENTS_TOTAL).filter(a=>a.bs[s]>0).map(a=>({...a,m:a.bs[s]})).sort((a,b)=>b.m-a.m)[0]
          }));
          return(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                <h3 style={{margin:0,fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>🏆 Top Agents by BOB Members</h3>
                <BobBadge/>
              </div>
              <p style={{color:"#475569",fontSize:12,margin:"0 0 14px"}}>
                Showing top {filteredAgents.length} agents  ·  {selAgency?selAgency:"All Agencies"}  ·  {sel.length===0?"All states":sel.join(", ")}  ·  {filteredAgents.length} of {(activeAgents||AGENTS_TOTAL).filter(a=>a.ss.some(s=>active.includes(s))).length} total
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:10}}>
                {filteredAgents.map((a,i)=>(
                  <div key={i} style={{background:"#070d1a",borderRadius:10,padding:"12px 16px",border:"1px solid "+CLRS[i%CLRS.length]+"22",display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:CLRS[i%CLRS.length]+"22",border:"2px solid "+CLRS[i%CLRS.length]+"66",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,color:CLRS[i%CLRS.length],fontSize:14,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{color:"#f1f5f9",fontWeight:700,fontSize:13,lineHeight:1.2}}>{a.n}</div>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                        <span style={{background:CLRS[i%CLRS.length]+"33",borderRadius:4,padding:"1px 6px",color:CLRS[i%CLRS.length],fontSize:10,fontWeight:700}}>{a.s}</span>
                        <span style={{color:"#475569",fontSize:10}}>{SNAME[a.s]||a.s}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:CLRS[i%CLRS.length],fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:20}}>{fmt(a.m)}</div>
                      <div style={{color:"#334155",fontSize:10}}>members</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-state agent summary */}
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <h3 style={{margin:"0 0 14px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:14}}>📍 Agent Summary by State</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
                {stateAgentCount.filter(s=>s.count>0).map((s,i)=>(
                  <div key={s.state} style={{background:"#070d1a",borderRadius:10,padding:"12px 14px",border:"1px solid "+CLRS[i%CLRS.length]+"22"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:16,color:"#f1f5f9"}}>{s.state}</div>
                      <div style={{background:CLRS[i%CLRS.length]+"22",borderRadius:5,padding:"2px 7px",color:CLRS[i%CLRS.length],fontWeight:700,fontSize:11}}>{s.count} agents</div>
                    </div>
                    <div style={{color:"#475569",fontSize:10,marginBottom:4}}>Top agent:</div>
                    <div style={{color:"#f1f5f9",fontSize:12,fontWeight:600,lineHeight:1.2}}>{s.top?s.top.n:"-"}</div>
                    <div style={{color:CLRS[i%CLRS.length],fontWeight:700,fontSize:15,marginTop:4}}>{s.top?fmt(s.top.m):"0"} <span style={{color:"#334155",fontSize:10,fontWeight:400}}>members</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          );
        })()}

        {/* OPPORTUNITY TAB */}
        {tab==="opportunity"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Live CMS loading status */}
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              {dashCmsLoading
                ? <span style={{color:ELIGIBLE,fontSize:12}}>⏳ Loading live CMS data for {active.length} states...</span>
                : dashCmsLoaded.size>0
                  ? <span style={{color:"#4ade80",fontSize:12}}>🟢 Live CMS data loaded for {dashCmsLoaded.size} states</span>
                  : <span style={{color:"#475569",fontSize:12}}>Loading CMS data...</span>
              }
              <span style={{color:"#334155",fontSize:11}}>Source: CMS Medicare Monthly Enrollment API  ·  2024</span>
            </div>

            {/* State opportunity cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
              {oppData.map((d,i)=>(
                <div key={d.state} style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid "+(d.isLive?"#16a34a44":"#1e293b")}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:17,color:"#f1f5f9"}}>{d.state}</div>
                      <div style={{color:"#475569",fontSize:10}}>{SNAME[d.state]||d.state}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                      <div style={{background:d.isLive?"#052e16":"#1e293b",borderRadius:4,padding:"2px 6px",fontSize:9,color:d.isLive?"#4ade80":"#475569"}}>{d.isLive?"🟢 LIVE CMS "+(d.year||2024):"📊 BOB Est."}</div>
                      <div style={{background:"#1e293b",borderRadius:4,padding:"2px 6px",fontSize:10,color:"#f97316",fontWeight:700}}>{d.penetration}% pen.</div>
                    </div>
                  </div>
                  {[
                    ["👥 BOB Members",   d.bobM.toLocaleString(),         "#a78bfa"],
                    ["🏥 MA-Eligible",   fmt(d.eligible),                  ELIGIBLE],
                    ["✅ In MA",          fmt(d.maEnrolled),               "#0ea5e9"],
                    ["⚠ In FFS",        fmt(d.ffsGap),                   "#f97316"],
                    ["💡 Potential (+3%)",fmt(d.potential),                UHC_GOLD],
                  ].map(([l,v,c])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{color:"#475569",fontSize:10}}>{l}</span>
                      <span style={{color:c,fontWeight:700,fontSize:12}}>{v}</span>
                    </div>
                  ))}
                  <div style={{marginTop:8,background:"#1e293b",borderRadius:4,height:5,overflow:"hidden"}}>
                    <div style={{width:Math.min(d.penetration,100)+"%",background:"linear-gradient(90deg,"+UHC_BLUE+","+UHC_GOLD+")",height:"100%",borderRadius:4}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Gap bar chart - uses live CMS eligible */}
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:6}}>
                <h3 style={{margin:0,fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>💡 Market Gap - BOB Members vs MA-Eligible (CMS Live)</h3>
                <div style={{display:"flex",gap:6}}><BobBadge/><CmsBadge live={dashCmsLoaded.size>0}/></div>
              </div>
              <p style={{color:"#475569",fontSize:12,margin:"0 0 12px"}}>
                FFS beneficiaries not yet in MA = direct opportunity. Sorted by largest gap. 3% conversion rate = realistic near-term target.
              </p>
              <ResponsiveContainer width="100%" height={Math.max(oppData.length*38,200)}>
                <BarChart data={oppData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false}/>
                  <XAxis type="number" tick={{fill:"#64748b",fontSize:10}} axisLine={{stroke:"#1e293b"}} tickFormatter={fmt}/>
                  <YAxis dataKey="state" type="category" tick={{fill:"#94a3b8",fontSize:12,fontWeight:700}} axisLine={{stroke:"#1e293b"}} width={36}/>
                  <Tooltip
                    contentStyle={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8}}
                    labelStyle={{color:UHC_GOLD}}
                    formatter={(v,n)=>{
                      if(n==="ffsGap") return [v.toLocaleString(),"In FFS (not in MA)"];
                      if(n==="bobM")   return [v.toLocaleString(),"BOB Members"];
                      if(n==="potential") return [v.toLocaleString(),"Potential Enrollments (+3%)"];
                      return [v,n];
                    }}
                  />
                  <Legend wrapperStyle={{fontSize:11}} itemStyle={{color:"#f1f5f9"}}/>
                  <Bar dataKey="bobM"    fill="#8b5cf6"          radius={[0,4,4,0]} name="bobM"/>
                  <Bar dataKey="ffsGap"  fill={ELIGIBLE+"55"}    radius={[0,4,4,0]} name="ffsGap" stroke={ELIGIBLE} strokeWidth={1}/>
                  <Bar dataKey="potential" fill={UHC_GOLD+"88"}  radius={[0,4,4,0]} name="potential" stroke={UHC_GOLD} strokeWidth={1}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Director message */}
            <div style={{background:"#0c1a0c",border:"1px solid #16a34a44",borderRadius:10,padding:16}}>
              <p style={{margin:0,color:"#86efac",fontSize:13,lineHeight:1.8}}>
                🚀 <strong>Message to State Director:</strong> {selAgency||"AllCare Mar IMO"} has{" "}
                <strong style={{color:"#a78bfa"}}>{fmt(kpis.tm)} active MA members</strong>{" "}
                {sel.length===1
                  ? <>in <strong style={{color:UHC_GOLD}}>{SNAME[sel[0]]||sel[0]}</strong></>
                  : sel.length===0
                    ? <>across <strong style={{color:UHC_GOLD}}>all {active.length} states</strong></>
                    : <>across <strong style={{color:UHC_GOLD}}>{active.length} states</strong></>
                }, managed by{" "}
                <strong style={{color:ENROLL}}>{kpis.ta} licensed agents</strong>.{" "}
                The total MA-eligible population{dashCmsLoaded.size>0?" (live CMS "+(oppData.filter(d=>d.isLive).reduce((mx,d)=>d.year>mx?d.year:mx,2024))+")" :""} is{" "}
                <strong style={{color:ELIGIBLE}}>{fmt(oppData.reduce((a,d)=>a+d.eligible,0))}</strong>,
                of which <strong style={{color:"#f97316"}}>{fmt(oppData.reduce((a,d)=>a+d.ffsGap,0))} are still in Traditional Medicare (FFS)</strong> -
                beneficiaries who are Medicare-eligible but NOT yet enrolled in any MA plan.
                {dashCmsLoaded.size>0?" This is real CMS data.":""} At a conservative 3% conversion rate with state lead access,
                that represents <strong style={{color:UHC_GOLD}}>{fmt(oppData.reduce((a,d)=>a+d.potential,0))} additional enrollments</strong> within reach.
              </p>
            </div>
          </div>
        )}

        {/* RETENTION TAB */}
        {tab==="retention"&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Header + context */}
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <span style={{color:"#4ade80",fontSize:12}}>🟢 22 monthly snapshots  ·  Apr 2024 - Apr 2026  ·  {RETENTION_DATA.snapshots.length} data points</span>
              <span style={{color:"#334155",fontSize:11}}>Source: ACM BOB historical series  ·  MBI-based tracking</span>
            </div>

            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
              <div style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:11,marginBottom:4}}>🔄 Avg Monthly Retention</div>
                <div style={{color:"#4ade80",fontSize:28,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{retentionData.avgRet}%</div>
                <div style={{color:"#64748b",fontSize:10}}>Last period: {retentionData.lastRet}%</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:11,marginBottom:4}}>⚠ Total Disenrollment</div>
                <div style={{color:"#f97316",fontSize:28,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{retentionData.totalChurned.toLocaleString()}</div>
                <div style={{color:"#64748b",fontSize:10}}>Miembros perdidos</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:11,marginBottom:4}}>♻ Win-backs</div>
                <div style={{color:UHC_GOLD,fontSize:28,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{retentionData.totalWinback.toLocaleString()}</div>
                <div style={{color:"#64748b",fontSize:10}}>Left and came back</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:11,marginBottom:4}}>✨ New Members</div>
                <div style={{color:ENROLL,fontSize:28,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{retentionData.totalNew.toLocaleString()}</div>
                <div style={{color:"#64748b",fontSize:10}}>First-time enrollments</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"14px 16px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:11,marginBottom:4}}>👥 Current Active</div>
                <div style={{color:"#a78bfa",fontSize:28,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{retentionData.currentActive.toLocaleString()}</div>
                <div style={{color:"#64748b",fontSize:10}}>At latest snapshot</div>
              </div>
            </div>

            {/* Retention Rate Line Chart */}
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>🔄 Monthly Retention Rate Trend</h3>
              <p style={{color:"#475569",fontSize:12,margin:"0 0 12px"}}>
                % of previous month members still active. Higher is better. Dips indicate mass disenrollment events (OEP, AEP transitions, plan terminations).
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={retentionData.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="snap" tick={{fill:"#94a3b8",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                  <YAxis yAxisId="left" domain={[80,100]} tick={{fill:"#94a3b8",fontSize:10}} axisLine={{stroke:"#1e293b"}} label={{value:"Retention %",angle:-90,position:"insideLeft",fill:"#64748b",fontSize:11}}/>
                  <YAxis yAxisId="right" orientation="right" tick={{fill:"#94a3b8",fontSize:10}} axisLine={{stroke:"#1e293b"}} label={{value:"Members",angle:90,position:"insideRight",fill:"#64748b",fontSize:11}}/>
                  <Tooltip contentStyle={{background:"#020817",border:"1px solid #1e293b",borderRadius:8}} labelStyle={{color:UHC_GOLD}}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                  <Bar yAxisId="right" dataKey="total" fill="#1e293b" name="Total Members" radius={[4,4,0,0]}/>
                  <Line yAxisId="left" type="monotone" dataKey="retRate" stroke="#4ade80" strokeWidth={3} dot={{fill:"#4ade80",r:4}} name="Retention %"/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Retained / New / Winback / Disenrollment stacked bars */}
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>📊 Monthly Member Flow - Retained vs Disenrollment vs New vs Win-backs</h3>
              <p style={{color:"#475569",fontSize:12,margin:"0 0 12px"}}>
                Breakdown of each month: green = retained, blue = new, gold = win-backs (came back), orange = disenrolled (lost).
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={retentionData.rows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="snap" tick={{fill:"#94a3b8",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                  <YAxis tick={{fill:"#94a3b8",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                  <Tooltip contentStyle={{background:"#020817",border:"1px solid #1e293b",borderRadius:8}} labelStyle={{color:UHC_GOLD}}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                  <Bar dataKey="retained" stackId="a" fill="#4ade80" name="Retained" radius={[0,0,0,0]}/>
                  <Bar dataKey="new" stackId="a" fill={ENROLL} name="New"/>
                  <Bar dataKey="winback" stackId="a" fill={UHC_GOLD} name="Win-back"/>
                  <Bar dataKey="churned" stackId="b" fill="#f97316" name="Disenrollment" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Two column: Tenure + Agency Ranking */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:12}}>

              {/* Tenure Distribution */}
              <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
                <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>⏱ Member Tenure Distribution</h3>
                <p style={{color:"#475569",fontSize:12,margin:"0 0 12px"}}>How long current active members have been with us (based on policyEffectiveDate).</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={retentionData.tenureRows} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false}/>
                    <XAxis type="number" tick={{fill:"#94a3b8",fontSize:10}} axisLine={{stroke:"#1e293b"}}/>
                    <YAxis dataKey="bucket" type="category" tick={{fill:"#f1f5f9",fontSize:11,fontWeight:700}} axisLine={{stroke:"#1e293b"}} width={70}/>
                    <Tooltip contentStyle={{background:"#020817",border:"1px solid #1e293b",borderRadius:8}} labelStyle={{color:UHC_GOLD}}/>
                    <Bar dataKey="count" fill="#a78bfa" radius={[0,4,4,0]} name="Members"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Agency Ranking Table */}
              {retentionData.agencyRanking && retentionData.agencyRanking.length > 0 && (
                <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
                  <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>🏆 Agency Retention Ranking</h3>
                  <p style={{color:"#475569",fontSize:12,margin:"0 0 12px"}}>Avg monthly retention by agency. Sorted by current member count.</p>
                  <div style={{overflow:"auto",maxHeight:320}}>
                    <table style={{width:"100%",fontSize:12,color:"#f1f5f9",borderCollapse:"collapse"}}>
                      <thead style={{position:"sticky",top:0,background:"#0f172a"}}>
                        <tr style={{borderBottom:"1px solid #1e293b"}}>
                          <th style={{textAlign:"left",padding:"8px 4px",color:"#94a3b8",fontWeight:600}}>Agency</th>
                          <th style={{textAlign:"right",padding:"8px 4px",color:"#94a3b8",fontWeight:600}}>Members</th>
                          <th style={{textAlign:"right",padding:"8px 4px",color:"#94a3b8",fontWeight:600}}>Avg Ret%</th>
                          <th style={{textAlign:"right",padding:"8px 4px",color:"#94a3b8",fontWeight:600}}>Disenroll.</th>
                          <th style={{textAlign:"right",padding:"8px 4px",color:"#94a3b8",fontWeight:600}}>Win-b</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retentionData.agencyRanking.map(function(r){
                          var color = r.avgRetRate >= 98 ? "#4ade80" : r.avgRetRate >= 95 ? UHC_GOLD : "#f97316";
                          return (
                            <tr key={r.agency} style={{borderBottom:"1px solid #0f172a"}}>
                              <td style={{padding:"6px 4px",fontWeight:600}}>{r.agency}</td>
                              <td style={{padding:"6px 4px",textAlign:"right",color:"#a78bfa"}}>{r.members.toLocaleString()}</td>
                              <td style={{padding:"6px 4px",textAlign:"right",color:color,fontWeight:700}}>{r.avgRetRate}%</td>
                              <td style={{padding:"6px 4px",textAlign:"right",color:"#f97316"}}>{r.churned}</td>
                              <td style={{padding:"6px 4px",textAlign:"right",color:UHC_GOLD}}>{r.winback}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Director message */}
            <div style={{background:"#0c1a0c",border:"1px solid #16a34a44",borderRadius:10,padding:16}}>
              <p style={{margin:0,color:"#86efac",fontSize:13,lineHeight:1.8}}>
                🔄 <strong>Retention Insight:</strong> {selAgency || "AllCare Mar IMO"} maintains an average monthly retention rate of{" "}
                <strong style={{color:"#4ade80"}}>{retentionData.avgRet}%</strong>, with{" "}
                <strong style={{color:"#f97316"}}>{retentionData.totalChurned.toLocaleString()} disenrolled</strong> and{" "}
                <strong style={{color:UHC_GOLD}}>{retentionData.totalWinback.toLocaleString()} win-backs</strong> across the tracked period.
                Win-backs represent members who previously disenrolled but returned - a strong indicator of brand loyalty and agent relationships.
                Monthly retention above 97% is considered excellent in Medicare Advantage (industry benchmark: 88-92%).
              </p>
            </div>
          </div>
        )}



        {/* ACTION PLAN TAB */}
        {tab==="actionplan"&&(()=>{
          // Data computation respecting filters (selAgency, sel)
          var snapLabels = RETENTION_DATA.snapshots;
          var lastSnap = snapLabels[snapLabels.length - 1];
          var prevSnap = snapLabels.length > 1 ? snapLabels[snapLabels.length - 2] : null;

          // Select dataset based on filters
          var selAgencyShort = selAgency || null;
          var stateFilter = sel.length > 0 ? sel : null;

          // Get current (latest) rows filtered
          var currentData;
          if (selAgencyShort) {
            currentData = RETENTION_DATA.byAgency.filter(function(r){ return r.agency === selAgencyShort; });
          } else if (stateFilter) {
            currentData = RETENTION_DATA.byState.filter(function(r){ return stateFilter.indexOf(r.state) !== -1; });
            // Aggregate by snap
            var bySnap = {};
            currentData.forEach(function(r){
              if (!bySnap[r.snap]) bySnap[r.snap] = {snap:r.snap, total:0, retained:0, "new":0, winback:0, churned:0};
              bySnap[r.snap].total += r.total;
              bySnap[r.snap].retained += r.retained;
              bySnap[r.snap]["new"] += r["new"];
              bySnap[r.snap].winback += r.winback;
              bySnap[r.snap].churned += r.churned;
            });
            currentData = Object.values(bySnap).map(function(r){
              var denom = r.retained + r.churned;
              r.retRate = denom > 0 ? +((r.retained / denom) * 100).toFixed(2) : null;
              return r;
            });
          } else {
            currentData = RETENTION_DATA.global;
          }

          currentData = currentData.slice().sort(function(a,b){ return a.snap < b.snap ? -1 : 1; });
          var latest = currentData[currentData.length - 1];
          var previous = currentData.length > 1 ? currentData[currentData.length - 2] : null;

          // Find agencies with negative delta (only when not filtered by one agency)
          var negativeAgencies = [];
          var topGrowthAgencies = [];
          var lowRetentionAgencies = [];
          if (!selAgencyShort) {
            var lastAgencyRows = RETENTION_DATA.byAgency.filter(function(r){ return r.snap === lastSnap; });
            var prevAgencyRows = RETENTION_DATA.byAgency.filter(function(r){ return r.snap === prevSnap; });
            var prevByName = {};
            prevAgencyRows.forEach(function(r){ prevByName[r.agency] = r; });

            lastAgencyRows.forEach(function(r){
              var prevR = prevByName[r.agency];
              if (!prevR) return;
              var delta = r.total - prevR.total;
              var gross = r["new"] + r.winback;
              // Only consider agencies with meaningful size
              if (r.total >= 50) {
                if (delta < 0) negativeAgencies.push({agency:r.agency, delta:delta, current:r.total, churned:r.churned, gross:gross});
                if (gross > 0) topGrowthAgencies.push({agency:r.agency, gross:gross, new:r["new"], winback:r.winback, delta:delta});
                if (r.retRate !== null && r.retRate < 99) lowRetentionAgencies.push({agency:r.agency, retRate:r.retRate, churned:r.churned, total:r.total});
              }
            });
            negativeAgencies.sort(function(a,b){ return a.delta - b.delta; });
            topGrowthAgencies.sort(function(a,b){ return b.gross - a.gross; });
            lowRetentionAgencies.sort(function(a,b){ return a.retRate - b.retRate; });
          }

          // Retention trend (last 4 weeks)
          var lastFour = currentData.slice(-4).filter(function(r){ return r.retRate !== null && r.retRate !== undefined; });
          var trendDirection = "stable";
          var trendText = "stable";
          if (lastFour.length >= 2) {
            var diff = lastFour[lastFour.length-1].retRate - lastFour[0].retRate;
            if (diff > 0.5) { trendDirection = "up"; trendText = "improving"; }
            else if (diff < -0.5) { trendDirection = "down"; trendText = "declining"; }
          }

          // Tenure risk (recent members)
          var tenureRows;
          if (selAgencyShort) {
            tenureRows = RETENTION_DATA.tenureByAgency.filter(function(r){ return r.agency === selAgencyShort; });
          } else if (stateFilter) {
            var tenMap = {};
            RETENTION_DATA.tenureByState.forEach(function(r){
              if (stateFilter.indexOf(r.state) === -1) return;
              tenMap[r.bucket] = (tenMap[r.bucket] || 0) + r.count;
            });
            tenureRows = Object.keys(tenMap).map(function(b){ return {bucket:b, count:tenMap[b]}; });
          } else {
            tenureRows = Object.keys(RETENTION_DATA.tenureGlobal).map(function(b){
              return {bucket:b, count:RETENTION_DATA.tenureGlobal[b]};
            });
          }
          var tenureTotal = tenureRows.reduce(function(a,r){ return a + r.count; }, 0);
          var recentCount = tenureRows.filter(function(r){ return r.bucket === "0-3 mo" || r.bucket === "3-6 mo"; })
                                       .reduce(function(a,r){ return a + r.count; }, 0);
          var recentPct = tenureTotal > 0 ? (recentCount / tenureTotal * 100).toFixed(1) : 0;
          var matureCount = tenureRows.filter(function(r){ return r.bucket === "1-2 yr" || r.bucket === "2-3 yr" || r.bucket === "3+ yr"; })
                                       .reduce(function(a,r){ return a + r.count; }, 0);
          var maturePct = tenureTotal > 0 ? (matureCount / tenureTotal * 100).toFixed(1) : 0;

          // Build findings array
          var findings = [];
          var recommendations = [];

          // Finding 1: overall retention
          if (latest && latest.retRate !== null && latest.retRate !== undefined) {
            if (latest.retRate >= 99) {
              findings.push({
                type:"good",
                title:"Excellent Retention",
                text:"Current weekly retention rate is "+latest.retRate+"%, well above MA industry benchmark (88-92%)."
              });
            } else if (latest.retRate >= 95) {
              findings.push({
                type:"ok",
                title:"Good Retention",
                text:"Current retention rate is "+latest.retRate+"%. Still above industry benchmark but monitor closely."
              });
            } else {
              findings.push({
                type:"bad",
                title:"Retention Below Target",
                text:"Current retention rate is "+latest.retRate+"%. This is concerning - investigate disenrollment causes immediately."
              });
              recommendations.push("Schedule 1-on-1 with top 3 agents in this scope to review disenrollment cases");
              recommendations.push("Review term reason codes to identify systemic issues");
            }
          }

          // Finding 2: trend
          findings.push({
            type: trendDirection === "up" ? "good" : trendDirection === "down" ? "bad" : "ok",
            title: "Retention Trend (last 4 weeks): " + trendText,
            text: lastFour.length >= 2
              ? "From "+lastFour[0].retRate+"% to "+lastFour[lastFour.length-1].retRate+"% over "+lastFour.length+" snapshots."
              : "Not enough data for trend analysis."
          });

          // Finding 3: agencies losing members
          if (negativeAgencies.length > 0) {
            var names = negativeAgencies.slice(0,3).map(function(a){ return a.agency+" ("+a.delta+")"; }).join(", ");
            findings.push({
              type:"bad",
              title:negativeAgencies.length+" Agencies Lost Members This Period",
              text:"Agencies with negative delta: "+names
            });
            recommendations.push("Review agent activity in "+negativeAgencies[0].agency+" - largest decline");
            recommendations.push("Investigate if disenrollment is concentrated in specific states or plans");
          }

          // Finding 4: top growth
          if (topGrowthAgencies.length > 0 && !selAgencyShort) {
            var topAg = topGrowthAgencies[0];
            findings.push({
              type:"good",
              title:"Top Growing Agency: "+topAg.agency,
              text:"Added "+topAg.gross+" policies this period ("+topAg.new+" new + "+topAg.winback+" win-backs). Net delta: "+(topAg.delta >= 0 ? "+" : "")+topAg.delta
            });
            recommendations.push("Document "+topAg.agency+"'s sales approach as best practice for other agencies");
          }

          // Finding 5: tenure risk
          if (parseFloat(recentPct) > 40) {
            findings.push({
              type:"ok",
              title:"High Proportion of New Members",
              text:recentPct+"% of current policies are <6 months old. These are at higher risk of disenrollment during AEP/OEP."
            });
            recommendations.push("Prioritize retention calls for members with <6 months tenure before next AEP");
            recommendations.push("Assign member advocacy program to new enrollees");
          } else if (parseFloat(maturePct) > 40) {
            findings.push({
              type:"good",
              title:"Mature, Loyal Member Base",
              text:maturePct+"% of policies have 1+ years tenure. Strong retention foundation."
            });
          }

          // Finding 6: low retention specific agencies
          if (lowRetentionAgencies.length > 0) {
            var lowAg = lowRetentionAgencies[0];
            findings.push({
              type:"ok",
              title:"Agencies Below 99% Retention",
              text:lowRetentionAgencies.length+" agencies below 99%. Lowest: "+lowAg.agency+" at "+lowAg.retRate+"%"
            });
            recommendations.push("Run retention workshop with "+lowAg.agency+" team");
          }

          // Finding 7: win-back opportunity
          if (latest && latest.winback > 0) {
            findings.push({
              type:"good",
              title:"Win-back Activity",
              text:latest.winback+" members returned this period. These represent strong brand loyalty and agent relationships."
            });
            recommendations.push("Interview "+Math.min(latest.winback,5)+" recent win-back clients to understand what made them return");
          }

          // Disenrollment reduction recommendation
          if (latest && latest.churned > 0) {
            var projectedAnnualChurn = Math.round(latest.churned * 52);
            recommendations.push("Current pace projects "+projectedAnnualChurn.toLocaleString()+" disenrollments annually - set retention targets");
          }

          // Data freshness
          recommendations.push("Next scheduled BOB refresh: every Tuesday - ensure timely upload to /New folder");

          var filterLabel = selAgencyShort ? selAgencyShort : (stateFilter ? stateFilter.join(", ") : "All Agencies, All States");

          return (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Header */}
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:18}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div>
                  <h3 style={{margin:"0 0 4px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:16}}>🎯 Action Plan - Findings & Recommendations</h3>
                  <p style={{margin:0,color:"#64748b",fontSize:12}}>Auto-generated insights from BOB history  ·  Scope: <span style={{color:UHC_GOLD,fontWeight:700}}>{filterLabel}</span></p>
                </div>
                <div style={{fontSize:11,color:"#94a3b8"}}>As of {lastSnap}</div>
              </div>
            </div>

            {/* Key metrics snapshot */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
              <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:10,marginBottom:3}}>📊 CURRENT TOTAL</div>
                <div style={{color:"#a78bfa",fontSize:22,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{latest ? latest.total.toLocaleString() : "N/A"}</div>
                <div style={{color:"#64748b",fontSize:10}}>policies at {lastSnap}</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:10,marginBottom:3}}>🔄 RETENTION RATE</div>
                <div style={{color: latest && latest.retRate >= 99 ? "#4ade80" : latest && latest.retRate >= 95 ? UHC_GOLD : "#f97316",fontSize:22,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{latest && latest.retRate ? latest.retRate + "%" : "N/A"}</div>
                <div style={{color:"#64748b",fontSize:10}}>vs previous period</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:10,marginBottom:3}}>⚠ DISENROLLMENT</div>
                <div style={{color:"#f97316",fontSize:22,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{latest ? latest.churned : 0}</div>
                <div style={{color:"#64748b",fontSize:10}}>policies disenrolled</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:10,marginBottom:3}}>✨ GROSS ADDS</div>
                <div style={{color:ENROLL,fontSize:22,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{latest ? (latest["new"] + latest.winback) : 0}</div>
                <div style={{color:"#64748b",fontSize:10}}>{latest ? latest["new"] : 0} new + {latest ? latest.winback : 0} wb</div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b"}}>
                <div style={{color:"#475569",fontSize:10,marginBottom:3}}>📈 NET DELTA</div>
                <div style={{color: latest && previous && (latest.total - previous.total) >= 0 ? "#4ade80" : "#f97316",fontSize:22,fontWeight:700,fontFamily:"'Space Grotesk',sans-serif"}}>{latest && previous ? ((latest.total - previous.total) >= 0 ? "+" : "") + (latest.total - previous.total) : "N/A"}</div>
                <div style={{color:"#64748b",fontSize:10}}>week over week</div>
              </div>
            </div>

            {/* Findings */}
            <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
              <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>🔍 Key Findings ({findings.length})</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {findings.map(function(f, i){
                  var bg = f.type === "good" ? "#052e16" : f.type === "bad" ? "#3f1212" : "#1e1b00";
                  var border = f.type === "good" ? "#16a34a44" : f.type === "bad" ? "#dc262644" : "#ca8a0444";
                  var color = f.type === "good" ? "#4ade80" : f.type === "bad" ? "#f97316" : UHC_GOLD;
                  var icon = f.type === "good" ? "✓" : f.type === "bad" ? "⚠" : "◆";
                  return (
                    <div key={i} style={{background:bg,border:"1px solid "+border,borderRadius:8,padding:"12px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{color:color,fontSize:14,fontWeight:700}}>{icon}</span>
                        <span style={{color:"#f1f5f9",fontSize:13,fontWeight:700}}>{f.title}</span>
                      </div>
                      <div style={{color:"#cbd5e1",fontSize:12,lineHeight:1.5,paddingLeft:22}}>{f.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div style={{background:"#0f172a",borderRadius:12,padding:18,border:"1px solid #1e293b"}}>
                <h3 style={{margin:"0 0 12px",fontFamily:"'Space Grotesk',sans-serif",color:"#f1f5f9",fontSize:15}}>💡 Recommended Actions ({recommendations.length})</h3>
                <ol style={{margin:0,paddingLeft:20,color:"#cbd5e1",fontSize:13,lineHeight:1.8}}>
                  {recommendations.map(function(r, i){
                    return <li key={i} style={{marginBottom:4}}>{r}</li>;
                  })}
                </ol>
              </div>
            )}

            {/* Definitions */}
            <div style={{background:"#0c1a2e",border:"1px solid #1e40af44",borderRadius:10,padding:16}}>
              <h3 style={{margin:"0 0 10px",fontFamily:"'Space Grotesk',sans-serif",color:"#93c5fd",fontSize:13}}>📖 Key Metric Definitions</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10,fontSize:11,color:"#cbd5e1",lineHeight:1.6}}>
                <div><strong style={{color:"#4ade80"}}>Retained:</strong> Policies that were active in previous snapshot AND current snapshot</div>
                <div><strong style={{color:ENROLL}}>New:</strong> Policies appearing for the first time (never seen before)</div>
                <div><strong style={{color:UHC_GOLD}}>Win-back:</strong> Policies that existed, left, and returned</div>
                <div><strong style={{color:"#f97316"}}>Disenrollment:</strong> Policies that disappeared - cancelled, moved to competitor, deceased, lost eligibility, or plan terminated</div>
                <div><strong style={{color:"#a78bfa"}}>Delta:</strong> Net change = New + Win-backs - Disenrollment. Positive = growing, negative = losing net</div>
                <div><strong style={{color:"#4ade80"}}>Retention Rate:</strong> % of previous-snapshot policies that are still active. Industry benchmark: 88-92%</div>
              </div>
            </div>

          </div>
          );
        })()}


        {/* FOOTER */}
        <div style={{marginTop:22,padding:"12px 0",borderTop:"1px solid #0f172a",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            <span style={{color:"#94a3b8",fontSize:10}}>📊 BOB: ACM_BOB_04-28-26.xlsx  ·  21,648 active policies  ·  776 counties  ·  134 agents  ·  22 states</span>
            <span style={{color:"#94a3b8",fontSize:10}}>🟢 MA-Eligible: CMS Medicare Monthly Enrollment API  ·  data.cms.gov  ·  YEAR=2025 (fallback 2024)  ·  A_B_TOT_BENES  ·  ffsGap=A_B_TOT_BENES−MA_AND_OTH_BENES (REAL data)</span>
            <span style={{color:"#94a3b8",fontSize:10}}>⚠ Confidential & Proprietary - UnitedHealth Group. Do not distribute without permission.</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src={LOGO} alt="AllCare Mar" style={{height:28,width:"auto",objectFit:"contain",background:"#ffffff",borderRadius:6,padding:"2px 7px"}}/>
            <span style={{color:UHC_GOLD,fontSize:10,fontWeight:600}}>(c) 2026 AllCare Mar Insurance Advisors  ·  UHC IMO Partner</span>
          </div>
        </div>
      </div>
    </div>
  );
}

