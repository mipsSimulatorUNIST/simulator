	.data
	.text
main:
	addu	$2, $4, $5
	addu	$2, $6, $7
	subu	$9, $3, $2
lab1:
	and	$11, $11, $0
	addiu	$10, $10, 0x1
	or	$6, $6, $0
	jal	lab3
lab3:
	sll	$7, $6, 2
	srl	$5, $4, 2
	sltiu	$9, $10, 100
	beq	$9, $0, lab4
	jr	$31
lab4:
	sltu	$4, $2, $3
	bne	$4, $0, lab5
	j	lab1
lab5:
	ori	$16, $16, 0xf0f0
