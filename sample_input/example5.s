	.data
data1:	.word	0x12c
data2:	.word	0xc8
	.text
main:
	and	$10, $10, $0
	and	$11, $11, $0
	la	$8, data1
	la	$9, data2
	addiu	$10, $10, 0x1
	sll	$10, $10, 1
	sll	$11, $11, 1
loop:
	addiu	$10, $10, 0x1
	addiu	$11, $11, 1
	or	$9, $9, $0
	subu	$18, $18, $10
	sll	$18, $17, 1
	sll	$17, $18, 1
	addu	$11, $11, $31
	nor	$16, $17, $18	
	bne	$11, $8, loop
	j	exit
exit:
	andi	$15, $15, 0x0f
