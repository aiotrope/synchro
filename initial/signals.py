from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404

from .models import Initial
from items.models import Item

User = get_user_model()


@receiver(post_save, sender=Initial)
def delete_users_on_create(sender, instance=None, created=False, **kwargs):
    users = User.objects.filter(fabricated=True)
    usersObj = get_object_or_404(User, fabricated=True)

    if created:
        if User.objects.filter(id=usersObj.id).exists():
            users.delete()
        if Item.objects.filter(merchant=usersObj).exists():
            items = Item.objects.filter(merchant=users)
            items.delete()


@receiver(post_save, sender=Initial)
def generate_users_on_create(sender, instance=None, created=True, **kwargs):

    users_count = User.objects.filter(fabricated=True).count()

    if users_count == 0:

        User.objects.bulk_create([
            User(
                username='testuser1',
                email='testuser1@sharklasers.com',
                password=make_password('ik{Tgo2*'),
                is_active=True,
                fabricated=True
            ),
            User(
                username='testuser2',
                email='qwert12@sharklasers.com',
                password=make_password('y=:|zd48'),
                is_active=True,
                fabricated=True
            ),
            User(
                username='testuser3',
                email='zxcvtegh@sharklasers.com',
                password=make_password('8=#0(v-A'),
                is_active=True,
                fabricated=True
            ),
            User(
                username='testuser4',
                email='jklqbsd@grr.la',
                password=make_password('Gq16=O9u'),
                is_active=True,
                fabricated=True
            ),
            User(
                username='testuser5',
                email='yurtqah@grr.la',
                password=make_password('HvB*7yIT'),
                is_active=True,
                fabricated=True
            ),
            User(
                username='testuser6',
                email='jklqbsd@guerrillamail.info',
                password=make_password('gbEF7-SG'),
                is_active=True,
                fabricated=True
            ),
        ])


@receiver(post_save, sender=Initial)
def generate_default_users_items(sender, instance, created, **kwargs):

    user1 = User.objects.get(email='yurtqah@grr.la')
    user2 = User.objects.get(email='qwert12@sharklasers.com')
    user3 = User.objects.get(email='jklqbsd@guerrillamail.info')

    u1 = User.objects.all().filter(email='yurtqah@grr.la')

    if u1.exists():
        user1 = User.objects.get(email='yurtqah@grr.la')
        user_a = User.objects.get(id=user1.id)

        item1 = Item.objects.create(
            name='Resistance Weld 0-60',
            description='Webster Instruments Inc. 2801 Resistance Weld 0-6000 x 100 lbs.',
            price='89,99',
            merchant=user_a,

        )
        item2 = Item.objects.create(
            name='Lot of 4 Chance Hoist 1 Ton Hot Stick Ratcheting',
            description='Heavy lot weighs about 40 lbs ships ONLY fedex / ups ground lower 48 USA',
            price='499,99',
            merchant=user_a,

        )
        item3 = Item.objects.create(
            name='Genuine OEM Genie Lift',
            description='Genuine OEM Genie Lift 75397 75397GT PIN, CLEVIS, .844X2.25 RET.CABLE Zinc 5/8"',
            price='99,99',
            merchant=user_a,

        )
        item4 = Item.objects.create(
            name='2 Genuine OEM Genie 81175 81175GT PIN 1.25 DIA X 1',
            description='2 Genuine OEM Genie 81175 81175GT PIN 1.25 DIA X 14.25 LG 4140 2 Hole breadcart mv',
            price='99,99',
            merchant=user_a,

        )
        item5 = Item.objects.create(
            name='Komatsu Forklift Exhaust Manifold 5141410720 Brand',
            description='Komatsu Forklift Exhaust Manifold 5141410720 Brand New 5-14141-072-0',
            price='149,55',
            merchant=user_a,
        )
        item6 = Item.objects.create(
            name='Altec Aerial Boom Truck Load Indicator Gauge 97012',
            description='Altec Aerial Boom Truck Load Indicator Gauge 970123556 w/ Bracket',
            price='75,98',
            merchant=user_a,
        )
        item7 = Item.objects.create(
            name='Bio-Rad Bio-Plex Luminex 200 Suspension Array Analyzer Unit2 - AV',
            description='Performing the calibration procedure and getting a passing result verifies that all the subsystems are operating together.The equipment requires the proper operation of the XYP stage, probe, probe flow control valve, probe actuator, syringe pump operation, and valving.',
            price='7,585',
            merchant=user_a,
        )
        item8 = Item.objects.create(
            name='Agilent 1200 Binary HPLC System with DAD',
            description='With tray, degasser, pumps and auto-sampler',
            price='21,657',
            merchant=user_a,
        )
        item9 = Item.objects.create(
            name='BIORAD CFX96 Touch Deep Well',
            description='The CFX96 Touch Deep Well Real-Time PCR Detection System provides precise quantification and target discrimination in large-volume reactions for up to 5 targets. The system combines industry-leading technology with stand-alone functionality to provide a reliable and easy-to-use qPCR instrument.',
            price='20,000',
            merchant=user_a,
        )
        item10 = Item.objects.create(
            name='Aspergillus brasiliensis derived from ATCC® 16404',
            description='Microbiologics® offers cannabis microbial testing quality control strains to help you ensure accurate results and keep consumers safe. We have all the required cannabis strains your laboratory needs in test-ready formats. Safe, simple, stable controls',
            price='73,55',
            merchant=user_a,
        )
    ########
    u2 = User.objects.all().filter(email='qwert12@sharklasers.com')

    if u2.exists():
        user2 = User.objects.get(email='qwert12@sharklasers.com')
        user_b = User.objects.get(id=user2.id)

        item11 = Item.objects.create(
            name='Viral Transport Med., 3mL HDx, Tube, pk20 R',
            description='Recommended for the collection and transport of clinical specimens for the recovery of viral agents including, but not limited to, Herpes Simplex Type I, Herpes Simplex Type II, Cytomegalovirus (CMV), Influenza A, Influenza B, Respiratory Syncytial Virus (RSV), Echovirus, Adenovirus, etc.',
            price='400,54',
            merchant=user_b,
        )
        item12 = Item.objects.create(
            name='ESPEC ETS04-3SW Environmental Chamber',
            description='ESPEC ETS04-3SW Environmental Chamber Thermal Chamber Test Chamber Test Equipment',
            price='14,899',
            merchant=user_b,
        )
        item13 = Item.objects.create(
            name='ESPEC LHU-113 Programmable Temperature and Humidity Test Environmental Chamber',
            description='This is a fully functional ESPEC LHU-113 Programmable Temperature and Humidity Test Environmental Chamber (-20oC to +85oC, 40% to 95% R.H.) in great cosmetic and working conditions. This environmental chamber has been very well maintained and just calibrated by our engineer to verify and guarantee the accuracy of temperature and the performance of the unit. The chamber has a temperature range of -20 oC to +85 oC and humidity range from 40% to 95% R.H.',
            price='6,854',
            merchant=user_b,
        )
        item14 = Item.objects.create(
            name='Agilent 34970A Data Acquisition Switch',
            description='3-slot mainframe with built-in GPIB and RS232 interfaces. 50k readings of non-volatile memory holds data when power is removed',
            price='2,144',
            merchant=user_b,
        )
        item15 = Item.objects.create(
            name='CYGNUS TECHNOLOGY CDAT4 DATA RECORDER SCSI BASED D',
            description='This two horizontal component seismograph was purchased new in 2013 from RLL Instruments, division of Zoltech Corp. in California, USA , and used for four years. Included with the  seismograph unit are a Garmin 2 GPS sensor to determine the precise location of the seismograph installation, a CD with software to run, store  and analyze two component digital seismograph records, a Lenovo computer to gather, store and view seismograph recordings, and a Users Manual with setup procedures and description of the adjustable user parameters in the software. Approximate dimensions of the seismograph unit are 11 x 11 x 20 inches.',
            price='3,000',
            merchant=user_b,
        )
        item16 = Item.objects.create(
            name='QIAgen QIAcube Automated DNA/RNA Purification System + ROTOR',
            description='Reliable DNA, RNA and miRNA extraction from virtually any sample type. Electrical Requirements: 220-240 V, 50-60 Hz, 650 VA.',
            price='2,900',
            merchant=user_b,
        ),
        item17 = Item.objects.create(
            name='ForteBIO Octet QKe System W/Dell T1700 PC and Data Acquisition',
            description='This system has been tested and is in excellent working order and includes a 30-day warranty. Cosmetically in good condition showing minor scuffs / scratches / blemishes from previous use.',
            price='18,000',
            merchant=user_b,

        )
        item18 = Item.objects.create(
            name='Maxwell DNA Extractor',
            description="Nucleic Acid Extraction for IVD and Research Use.",
            price='2,760',
            merchant=user_b,
        )
        item19 = Item.objects.create(
            name='Navac NRD16 Two-stage rotary vane vacuum pump',
            description='New from Manufacturer stock',
            price='2,900',
            merchant=user_b,
        )
        item20 = Item.objects.create(
            name="HEL Triple Walled Jacketed Glass Chemical Bioreactor",
            description='Reactors are available from a standard 250mL to 20L, but other sizes can be accomodated on request. Interchange of reactors is widely supported across the vessel range, with typically just a change of stirrer required. Self-sealing "Quick-Connects" remove the need to drain oil-jackets and make vessel interchange a quick and clean operation.',
            price="4,700",
            merchant=user_b,
        )
    ########
    u3 = User.objects.all().filter(email='jklqbsd@guerrillamail.info')

    if u3.exists():
        user3 = User.objects.get(email='jklqbsd@guerrillamail.info')
        user_c = User.objects.get(id=user3.id)

        item21 = Item.objects.create(
            name='Eclipse Cannabis Vape Pen and Cartridge Filler and Assembly Machine',
            description='Eclipse Cannabis Vape Pen and Cartridge Filler and Assembly Machine',
            price='375,000',
            merchant=user_c,
        )
        item22 = Item.objects.create(
            name='Fogg Liquid Filling Line for 250, 500, and 1000 ML Bottles',
            description='Filler sn #FAA 4400 570-2-7-92RH; 36 head; Filled 250 ml, 500 ml, and 1000 ml plastic bottles',
            price='40,000',
            merchant=user_c,
        )
        item23 = Item.objects.create(
            name='F.B.M 20000 Liters Reactor with Jacket',
            description='Unknown F.B.M 20000 Liters Reactor with Jacket',
            price='37,489',
            merchant=user_c,
        )
        item24 = Item.objects.create(
            name='CellGenix® Preclinical rh-TPO',
            description='CellGenix Preclinical Recombinant Human Thrombopoietin (TPO) is a xeno-free and animal-derived component-free product. It is produced in a dedicated animal-free GMP facility. TPO is used in the cell and gene therapy space for the ex vivo expansion and differentiation of hematopoietic stem cells (HSCs).',
            price='950,77',
            merchant=user_c,
        )
        item25 = Item.objects.create(
            name='AB sciex 7500',
            description='The need for a more flexible work style, driven by increased automation, while attaining consistent, high-quality results for all users, continues to grow among chromatographers. Shimadzu answers this need with its new line of i-Series integrated HPLC/UHPLC systems. Redefining integrated LC technology by adding innovative, intelligent and intuitive features to existing performance excellence, the integrated i-Series HPLC/UHPLC delivers outstanding data quality, improved workflow efficiency, and maximum uptime. Finally, an LC as smart and flexible as you!',
            price='89,000',
            merchant=user_c,
        )
        item26 = Item.objects.create(
            name='SIG-PRG Portable Signal Record & Generation System',
            description='Armagard SPRI-700-UK Water Proof Rack Mount Computer Cabinet',
            price='3,000',
            merchant=user_c,
        )
        item27 = Item.objects.create(
            name='G155825 National Instruments LAB-PC-1200 #183008E-',
            description='This National Instruments LAB-PC-1200 #183008E-01 Multifunction I/O Board appears to be in good cosmetic condition, although there are a few small dings, scratches, & signs of previous use.',
            price='298',
            merchant=user_c,
        )
        item28 = Item.objects.create(
            name='NIHON KOHDEN THERMAL ARRAY RECORDER',
            description='Temperature Logger Veriteq VL-1000-22L',
            price='575,98',
            merchant=user_c,
        )
        item29 = Item.objects.create(
            name='Percival Walk-In Cooler / Environmental Chamber with Cooling 95"x5',
            description="Percival walk-in cooler / environmental chamber available for sale. Complete with indoor evaporator, compressor, charter, and controls. Available from lab decom project, easy access. Overall Dims: 95 long x 5 deep x 95 High",
            price='3,000',
            merchant=user_c,
        )
        item30 = Item.objects.create(
            name='Guava PCA-96 Flow Cytometer with Computer and Software',
            description='ully automated flow cytometer built for accurately count cells while increasing production within your lab.  The PCA-96 from Guava (now owned by Millipore) has the capability of reading 96 well plates and 1.2ml, 1.5ml tubes.  The flexibility of the Guava PCA 96 platform combined with the sleek small footprint design makes this flow cytometer an attractive addition to any immunology and toxicology lab.  The Cytosoft software includes numerous applications such as cell viability, cell counting, Cell Toxicity, Cell Cycle, antibody quantitation, aptosis and many more.  The Guava PCA-96 can read a 96 well plate in just under a couple of minutes.    The small yet robust flow cytometer comes equipped with a green excitation laser running at 532nm.  Combined with yellow and red bio-color fluorescence dyes the Guava PCA-96 can handle almost every flow cytometry protocol including drug treatment, cancer and aging studies.   System comes with computer workstation running CytoSoft and all built-in assays.  It is very easy to maintain and comes with a 60-day warranty.  Don’t miss out on great opportunity to purchase this reliable Guava PCA-96 flow cytometer',
            price='8,900',
            merchant=user_c,
        )


""" @receiver(post_save, sender=Initial)
def delete_init(sender, instance, created, **kwargs):

    user1 = User.objects.get(email='yurtqah@grr.la')
    user2 = User.objects.get(email='qwert12@sharklasers.com')
    user3 = User.objects.get(email='jklqbsd@guerrillamail.info')

    item1 = Item.objects.filter(merchant=user1).count()
    item2 = Item.objects.filter(merchant=user2).count()
    item3 = Item.objects.filter(merchant=user3).count()

    if item1 == 10 and item2 == 10 and item3 == 10:
        initObj = get_object_or_404(Initial, name='init')           
        initObj.delete()
 
 """