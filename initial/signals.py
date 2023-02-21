from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404

from .models import Initial
from items.models import Item

User = get_user_model()


@receiver(post_save, sender=Initial)
def delete_users_and_items(sender, instance=None, created=False, **kwargs):

    if created:
        Item.objects.filter(merchant__fabricated=True).delete()
        User.objects.filter(fabricated=True).delete()
        


@receiver(post_save, sender=Initial)
def create_users(sender, instance=None, created=True, **kwargs):

    users_count = User.objects.filter(fabricated=True).count()

    if created:

        User.objects.bulk_create([
            User(
                username='testuser1',
                email='testuser1@sharklasers.com',
                password=make_password('passworD1!'),
                is_active=True,
                fabricated=True,
            ),
            User(
                username='testuser2',
                email='qwert12@sharklasers.com',
                password=make_password('passworD2!'),
                is_active=True,
                fabricated=True,
            ),
            User(
                username='testuser3',
                email='zxcvtegh@sharklasers.com',
                password=make_password('passworD3='),
                is_active=True,
                fabricated=True,
            ),
            User(
                username='testuser4',
                email='jklqbsd@grr.la',
                password=make_password('passworD4+'),
                is_active=True,
                fabricated=True,
            ),
            User(
                username='testuser5',
                email='yurtqah@grr.la',
                password=make_password('passworD5%'),
                is_active=True,
                fabricated=True,
            ),
            User(
                username='testuser6',
                email='jklqbsd@guerrillamail.info',
                password=make_password('passworD6#'),
                is_active=True,
                fabricated=True,
            ),
        ])


@receiver(post_save, sender=Initial)
def create_items(sender, instance, created, **kwargs):

    user1 = User.objects.get(email='yurtqah@grr.la')
    user2 = User.objects.get(email='qwert12@sharklasers.com')
    user3 = User.objects.get(email='jklqbsd@guerrillamail.info')

    u1 = User.objects.all().filter(email='yurtqah@grr.la')
    u2 = User.objects.all().filter(email='qwert12@sharklasers.com')
    u3 = User.objects.all().filter(email='jklqbsd@guerrillamail.info')

    user_b = User.objects.get(id=user2.id)
    user_a = User.objects.get(id=user1.id)
    user_c = User.objects.get(id=user3.id)

    if u1.exists() and u2.exists() and u3.exists():

        Item.objects.bulk_create([
            Item(
                name='Resistance Weld 0-60',
                description='Webster Instruments Inc. 2801 Resistance Weld 0-6000 x 100 lbs.',
                price_entry='89.99',
                merchant=user_a,
            ),
            Item(
                name='Lot of 4 Chance Hoist 1 Ton Hot Stick Ratcheting',
                description='Heavy lot weighs about 40 lbs ships ONLY fedex / ups ground lower 48 USA',
                price_entry='499.99',
                merchant=user_a,
            ),
            Item(
                name='Genuine OEM Genie Lift',
                description='Genuine OEM Genie Lift 75397 75397GT PIN, CLEVIS, .844X2.25 RET.CABLE Zinc 5/8"',
                price_entry='99.99',
                merchant=user_a,

            ),
            Item(
                name='2 Genuine OEM Genie 81175 81175GT PIN 1.25 DIA X 1',
                description='2 Genuine OEM Genie 81175 81175GT PIN 1.25 DIA X 14.25 LG 4140 2 Hole breadcart mv',
                price_entry='120.89',
                merchant=user_a,
            ),
            Item(
                name='Komatsu Forklift Exhaust Manifold 5141410720 Brand',
                description='Komatsu Forklift Exhaust Manifold 5141410720 Brand New 5-14141-072-0',
                price_entry='149.55',
                merchant=user_a,
            ),
            Item(
                name='Altec Aerial Boom Truck Load Indicator Gauge 97012',
                description='Altec Aerial Boom Truck Load Indicator Gauge 970123556 w/ Bracket',
                price_entry='75.98',
                merchant=user_a,
            ),
            Item(
                name='Bio-Rad Bio-Plex Luminex 200 Suspension Array Analyzer Unit2 - AV',
                description='Performing the calibration procedure and getting a passing result verifies that all the subsystems are operating together.The equipment requires the proper operation of the XYP stage, probe, probe flow control valve, probe actuator, syringe pump operation, and valving.',
                price_entry='7856.44',
                merchant=user_a,
            ),
            Item(
                name='Agilent 1200 Binary HPLC System with DAD',
                description='With tray, degasser, pumps and auto-sampler',
                price_entry='25897.22',
                merchant=user_a,
            ),
            Item(
                name='BIORAD CFX96 Touch Deep Well',
                description='The CFX96 Touch Deep Well Real-Time PCR Detection System provides precise quantification and target discrimination in large-volume reactions for up to 5 targets. The system combines industry-leading technology with stand-alone functionality to provide a reliable and easy-to-use qPCR instrument.',
                price_entry='20000.90',
                merchant=user_a,
            ),
            Item(
                name='Aspergillus brasiliensis derived from ATCC® 16404',
                description='Microbiologics® offers cannabis microbial testing quality control strains to help you ensure accurate results and keep consumers safe. We have all the required cannabis strains your laboratory needs in test-ready formats. Safe, simple, stable controls',
                price_entry='73.77',
                merchant=user_a,
            ),
            Item(
                name='Viral Transport Med., 3mL HDx, Tube, pk20 R',
                description='Recommended for the collection and transport of clinical specimens for the recovery of viral agents including, but not limited to, Herpes Simplex Type I, Herpes Simplex Type II, Cytomegalovirus (CMV), Influenza A, Influenza B, Respiratory Syncytial Virus (RSV), Echovirus, Adenovirus, etc.',
                price_entry='410.87',
                merchant=user_b,),
            Item(
                name='ESPEC ETS04-3SW Environmental Chamber',
                description='ESPEC ETS04-3SW Environmental Chamber Thermal Chamber Test Chamber Test Equipment',
                price_entry='14890.79',
                merchant=user_b,
            ),
            Item(
                name='ESPEC LHU-113 Programmable Temperature and Humidity Test Environmental Chamber',
                description='This is a fully functional ESPEC LHU-113 Programmable Temperature and Humidity Test Environmental Chamber (-20oC to +85oC, 40% to 95% R.H.) in great cosmetic and working conditions. This environmental chamber has been very well maintained and just calibrated by our engineer to verify and guarantee the accuracy of temperature and the performance of the unit. The chamber has a temperature range of -20 oC to +85 oC and humidity range from 40% to 95% R.H.',
                price_entry='7854.30',
                merchant=user_b,
            ),
            Item(
                name='Agilent 34970A Data Acquisition Switch',
                description='3-slot mainframe with built-in GPIB and RS232 interfaces. 50k readings of non-volatile memory holds data when power is removed',
                price_entry='2144',
                merchant=user_b,
            ),
            Item(
                name='CYGNUS TECHNOLOGY CDAT4 DATA RECORDER SCSI BASED D',
                description='This two horizontal component seismograph was purchased new in 2013 from RLL Instruments, division of Zoltech Corp. in California, USA , and used for four years. Included with the  seismograph unit are a Garmin 2 GPS sensor to determine the precise location of the seismograph installation, a CD with software to run, store  and analyze two component digital seismograph records, a Lenovo computer to gather, store and view seismograph recordings, and a Users Manual with setup procedures and description of the adjustable user parameters in the software. Approximate dimensions of the seismograph unit are 11 x 11 x 20 inches.',
                price_entry='3000',
                merchant=user_b,
            ),
            Item(
                name='QIAgen QIAcube Automated DNA/RNA Purification System + ROTOR',
                description='Reliable DNA, RNA and miRNA extraction from virtually any sample type. Electrical Requirements: 220-240 V, 50-60 Hz, 650 VA.',
                price_entry='2900',
                merchant=user_b,
            ),
            Item(
                name='ForteBIO Octet QKe System W/Dell T1700 PC and Data Acquisition',
                description='This system has been tested and is in excellent working order and includes a 30-day warranty. Cosmetically in good condition showing minor scuffs / scratches / blemishes from previous use.',
                price_entry='18567.33',
                merchant=user_b,
            ),
            Item(
                name='Maxwell DNA Extractor',
                description="Nucleic Acid Extraction for IVD and Research Use.",
                price_entry='2760.43',
                merchant=user_b,
            ),
            Item(
                name='Navac NRD16 Two-stage rotary vane vacuum pump',
                description='New from Manufacturer stock',
                price_entry='2900',
                merchant=user_b,
            ),
            Item(
                name='HEL Triple Walled Jacketed Glass Chemical Bioreactor',
                description='Reactors are available from a standard 250mL to 20L, but other sizes can be accomodated on request. Interchange of reactors is widely supported across the vessel range, with typically just a change of stirrer required. Self-sealing "Quick-Connects" remove the need to drain oil-jackets and make vessel interchange a quick and clean operation.',
                price_entry='4700.44',
                merchant=user_b,
            ),
            Item(
                name='Eclipse Cannabis Vape Pen and Cartridge Filler and Assembly Machine',
                description='Eclipse Cannabis Vape Pen and Cartridge Filler and Assembly Machine',
                price_entry='375000.10',
                merchant=user_c,
            ),
            Item(
                name='Fogg Liquid Filling Line for 250, 500, and 1000 ML Bottles',
                description='Filler sn #FAA 4400 570-2-7-92RH; 36 head; Filled 250 ml, 500 ml, and 1000 ml plastic bottles',
                price_entry='41235.90',
                merchant=user_c,
            ),
            Item(
                name='F.B.M 20000 Liters Reactor with Jacket',
                description='Unknown F.B.M 20000 Liters Reactor with Jacket',
                price_entry='37546.88',
                merchant=user_c,
            ),
            Item(
                name='CellGenix® Preclinical rh-TPO',
                description='CellGenix Preclinical Recombinant Human Thrombopoietin (TPO) is a xeno-free and animal-derived component-free product. It is produced in a dedicated animal-free GMP facility. TPO is used in the cell and gene therapy space for the ex vivo expansion and differentiation of hematopoietic stem cells (HSCs).',
                price_entry='950.77',
                merchant=user_c,
            ),
            Item(
                name='AB sciex 7500',
                description='The need for a more flexible work style, driven by increased automation, while attaining consistent, high-quality results for all users, continues to grow among chromatographers. Shimadzu answers this need with its new line of i-Series integrated HPLC/UHPLC systems. Redefining integrated LC technology by adding innovative, intelligent and intuitive features to existing performance excellence, the integrated i-Series HPLC/UHPLC delivers outstanding data quality, improved workflow efficiency, and maximum uptime. Finally, an LC as smart and flexible as you!',
                price_entry='89000',
                merchant=user_c,
            ),
            Item(
                name='SIG-PRG Portable Signal Record & Generation System',
                description='Armagard SPRI-700-UK Water Proof Rack Mount Computer Cabinet',
                price_entry='3000',
                merchant=user_c,
            ),
            Item(
                name='G155825 National Instruments LAB-PC-1200 #183008E-',
                description='This National Instruments LAB-PC-1200 #183008E-01 Multifunction I/O Board appears to be in good cosmetic condition, although there are a few small dings, scratches, & signs of previous use.',
                price_entry='298.88',
                merchant=user_c,
            ),
            Item(
                name='NIHON KOHDEN THERMAL ARRAY RECORDER',
                description='Temperature Logger Veriteq VL-1000-22L',
                price_entry='575.90',
                merchant=user_c,
            ),
            Item(
                name='Percival Walk-In Cooler / Environmental Chamber with Cooling 95"x5',
                description="Percival walk-in cooler / environmental chamber available for sale. Complete with indoor evaporator, compressor, charter, and controls. Available from lab decom project, easy access. Overall Dims: 95 long x 5 deep x 95 High",
                price_entry='3134.02',
                merchant=user_c,
            ),
            Item(
                name='Guava PCA-96 Flow Cytometer with Computer and Software',
                description='ully automated flow cytometer built for accurately count cells while increasing production within your lab.  The PCA-96 from Guava (now owned by Millipore) has the capability of reading 96 well plates and 1.2ml, 1.5ml tubes.  The flexibility of the Guava PCA 96 platform combined with the sleek small footprint design makes this flow cytometer an attractive addition to any immunology and toxicology lab.  The Cytosoft software includes numerous applications such as cell viability, cell counting, Cell Toxicity, Cell Cycle, antibody quantitation, aptosis and many more.  The Guava PCA-96 can read a 96 well plate in just under a couple of minutes.    The small yet robust flow cytometer comes equipped with a green excitation laser running at 532nm.  Combined with yellow and red bio-color fluorescence dyes the Guava PCA-96 can handle almost every flow cytometry protocol including drug treatment, cancer and aging studies.   System comes with computer workstation running CytoSoft and all built-in assays.  It is very easy to maintain and comes with a 60-day warranty.  Don’t miss out on great opportunity to purchase this reliable Guava PCA-96 flow cytometer',
                price_entry='8934.31',
                merchant=user_c,
            ),
        ])
