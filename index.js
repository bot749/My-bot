import discord
from discord.ext import commands
import asyncio

# التوكن الذي قمت بإرساله في الصورة
TOKEN = "MTI3ODc3MjlyNTk1NjM4NDdc2OQ.GXOnm5._d0ZglwDXKeklKkgRVW7eAmk03YxMQppooLS2c"

# ضع آيدي السيرفر التجريبي الخاص بكم هنا (مثال: 123456789012345678)
GUILD_ID = 123456789012345678 

# الآيدي المطلوب عمل منشن له بناءً على طلبك
TARGET_USER_ID = 1547918289819271241

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"تم تسجيل الدخول بنجاح باسم: {bot.user}")
    print("البوت جاهز لاختبار فتح وإغلاق التكتات بكثرة.")

@bot.command()
@commands.is_owner()
async def spam_tickets(ctx, count: int = 10):
    """
    أمر لفتح وإغلاق عدد كبير من التكتات بشكل متتابع
    الاستخدام: !spam_tickets 20 (مثلاً لفتح وإغلاق 20 تكت ورا بعض)
    """
    guild = ctx.guild
    if guild.id != GUILD_ID:
        await ctx.send("❌ هذا الأمر مخصص للسيرفر التجريبي فقط!")
        return

    await ctx.send(f"🚀 بدأ اختبار فتح وإغلاق {count} تكت مع المنشن المطلوب...")

    for i in range(1, count + 1):
        try:
            # 1. إعداد صلاحيات القناة (التكت)
            overwrites = {
                guild.default_role: discord.PermissionOverwrite(read_messages=False),
                guild.me: discord.PermissionOverwrite(read_messages=True, manage_channels=True)
            }
            
            # منح الصلاحية للشخص المراد منشنه حتى يصله الإشعار
            target_member = guild.get_member(TARGET_USER_ID)
            if target_member:
                overwrites[target_member] = discord.PermissionOverwrite(read_messages=True, send_messages=True)

            # إنشاء التكت (قناة نصية)
            ticket_channel = await guild.create_text_channel(
                name=f"test-ticket-{i:04d}",
                overwrites=overwrites,
                reason="Stress testing tickets and mentions"
            )
            
            print(f"تم فتح التكت: {ticket_channel.name}")

            # 2. إرسال رسالة مع المنشن المطلوب
            mention_text = f"<@{TARGET_USER_ID}>"
            await ticket_channel.send(f"مرحباً! هذا اختبار تكت رقم {i} لـ {mention_text}")

            # انتظار ثانية واحدة فقط لضمان وصول الرسالة وتسجيلها
            await asyncio.sleep(1)

            # 3. إغلاق وحذف التكت مباشرة
            await ticket_channel.delete(reason="Closing test ticket automatically")
            print(f"تم إغلاق وحذف التكت: {ticket_channel.name}")

            # وقفة قصيرة جداً لتفادي حظر الديسكورد (Rate Limit)
            await asyncio.sleep(1)

        except Exception as e:
            print(f"حدث خطأ في التكت رقم {i}: {e}")
            await ctx.send(f"❌ حدث خطأ في التكت رقم {i}. راجع الـ Terminal.")
            break

    await ctx.send("✅ انتهى اختبار التكتات المكثف بنجاح!")

# تشغيل البوت
bot.run(TOKEN)
  
