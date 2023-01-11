	.data
data1:	.word	100
data2:	.word	200
data3:	.word	0x12345678
	.word	0x12341
	.text
main:
	lui	$3, 0x1000
	lhu	$5, 0($3)
	lhu	$8, 4($3)
	lw	$9, 8($3)
	lw	$10, 12($3)
	addiu	$5, $5, 24
	addiu	$6, $0, 124
	addu	$7, $5, $6
	sh	$5, 16($3)
	sh	$6, 20($3)
	sh	$7, 24($3)
	addiu	$3, $3, 12
	lw	$12, -4($3)
	lhu	$13, -8($3)
	lhu	$14, -12($3)